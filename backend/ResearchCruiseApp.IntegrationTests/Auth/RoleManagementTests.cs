using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using ResearchCruiseApp.Api.Users;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Identity;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Auth;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class RoleManagementTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    [Theory]
    [InlineData("anonymous", RoleName.Guest, HttpStatusCode.Unauthorized)]
    [InlineData(RoleName.CruiseManager, RoleName.Guest, HttpStatusCode.Forbidden)]
    [InlineData(RoleName.Guest, RoleName.Guest, HttpStatusCode.Forbidden)]
    [InlineData(RoleName.ShipCrew, RoleName.Guest, HttpStatusCode.Forbidden)]
    [InlineData(RoleName.Shipowner, RoleName.Administrator, HttpStatusCode.Forbidden)]
    [InlineData(RoleName.Shipowner, RoleName.Shipowner, HttpStatusCode.Forbidden)]
    public async Task Grant_WhenActorIsNotAllowed_DeniesWithoutChangingMembership(
        string actorRole,
        string requestedRole,
        HttpStatusCode expected
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var target = await TestUsers.Create(app, "target@example.invalid", RoleName.CruiseManager);
        await TestUsers.Create(app, "role-holder@example.invalid", requestedRole);
        if (actorRole != "anonymous")
            await TestUsers.Create(app, "actor@example.invalid", actorRole);
        using var client =
            actorRole == "anonymous"
                ? app.CreateApiClient()
                : await TestApplications.Login(app, "actor@example.invalid");
        using var response = await client.PutAsync(
            $"/users/{target.Id}/roles/{requestedRole}",
            null,
            ct
        );
        Assert.Equal(expected, response.StatusCode);
        await AssertRoles(app, target.Id, [RoleName.CruiseManager]);
        Assert.Empty(app.Transport.Messages);
    }

    [Theory]
    [InlineData(RoleName.Administrator)]
    [InlineData(RoleName.Shipowner)]
    public async Task Role_WhenOfficeGrantsThenRemoves_PreservesOtherMembership(string actorRole)
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var target = await TestUsers.Create(app, "target@example.invalid", RoleName.CruiseManager);
        await TestUsers.Create(app, "role-holder@example.invalid", RoleName.Guest);
        await TestUsers.Create(app, "actor@example.invalid", actorRole);
        using var client = await TestApplications.Login(app, "actor@example.invalid");
        var route = $"/users/{target.Id}/roles/{RoleName.Guest}";
        using var granted = await client.PutAsync(route, null, ct);
        Assert.Equal(HttpStatusCode.NoContent, granted.StatusCode);
        await AssertRoles(app, target.Id, [RoleName.CruiseManager, RoleName.Guest]);
        using var removed = await client.DeleteAsync(route, ct);
        Assert.Equal(HttpStatusCode.NoContent, removed.StatusCode);
        await AssertRoles(app, target.Id, [RoleName.CruiseManager]);
        Assert.Empty(app.Transport.Messages);
    }

    [Theory]
    [InlineData(
        RoleName.Shipowner,
        RoleName.CruiseManager,
        RoleName.Guest,
        HttpStatusCode.NoContent
    )]
    [InlineData(
        RoleName.Administrator,
        RoleName.CruiseManager,
        RoleName.Guest,
        HttpStatusCode.NoContent
    )]
    [InlineData(RoleName.Administrator, "self+admin", RoleName.Guest, HttpStatusCode.Forbidden)]
    [InlineData(RoleName.Administrator, "self", RoleName.Guest, HttpStatusCode.Forbidden)]
    [InlineData(
        RoleName.Shipowner,
        RoleName.CruiseManager,
        RoleName.Administrator,
        HttpStatusCode.Forbidden
    )]
    [InlineData(
        RoleName.Shipowner,
        "CruiseManager,Shipowner",
        RoleName.Guest,
        HttpStatusCode.Forbidden
    )]
    public async Task Replace_ChecksAccessBeforeSwappingRolesAtomically(
        string actorRole,
        string target,
        string requestedRole,
        HttpStatusCode expected
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var actor = await TestUsers.Create(app, "actor@example.invalid", actorRole);
        await TestUsers.Create(app, "role-holder@example.invalid", requestedRole);
        if (target == "self+admin")
            await TestUsers.Create(app, "other-admin@example.invalid", RoleName.Administrator);
        var self = target is "self" or "self+admin";
        var originalRoles = self ? [actorRole] : target.Split(',');
        var targetUser = self
            ? actor
            : await TestUsers.Create(app, "target@example.invalid", originalRoles);
        using var client = await TestApplications.Login(app, "actor@example.invalid");
        using var response = await client.PutAsJsonAsync(
            $"/users/{targetUser.Id}/role",
            new { roleName = requestedRole },
            ct
        );
        Assert.Equal(expected, response.StatusCode);
        await AssertRoles(
            app,
            targetUser.Id,
            expected == HttpStatusCode.NoContent ? [requestedRole] : originalRoles
        );
    }

    [Theory]
    [InlineData(RoleName.Administrator)]
    [InlineData(RoleName.Shipowner)]
    public async Task OwnAccount_RoleChangesAndDeletion_AreRefused(string role)
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var actor = await TestUsers.Create(app, "actor@example.invalid", role);
        await TestUsers.Create(app, "other-admin@example.invalid", RoleName.Administrator);
        using var client = await TestApplications.Login(app, actor.Email!);
        using var removed = await client.DeleteAsync($"/users/{actor.Id}/roles/{role}", ct);
        using var replaced = await client.PutAsJsonAsync(
            $"/users/{actor.Id}/role",
            new { roleName = RoleName.Guest },
            ct
        );
        using var deleted = await client.DeleteAsync($"/users/{actor.Id}", ct);
        Assert.Equal(HttpStatusCode.Forbidden, removed.StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, replaced.StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, deleted.StatusCode);
        await AssertRoles(app, actor.Id, [role]);
    }

    [Fact]
    public async Task LastAdministrator_KeepsTheRoleAfterADemotedAdministratorActs()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var demoted = await TestUsers.Create(
            app,
            "demoted@example.invalid",
            RoleName.Administrator
        );
        var last = await TestUsers.Create(app, "last@example.invalid", RoleName.Administrator);
        using var staleToken = await TestApplications.Login(app, demoted.Email!);
        using var lastClient = await TestApplications.Login(app, last.Email!);
        using var demotion = await lastClient.DeleteAsync(
            $"/users/{demoted.Id}/roles/{RoleName.Administrator}",
            ct
        );
        Assert.Equal(HttpStatusCode.NoContent, demotion.StatusCode);
        using var refused = await staleToken.DeleteAsync(
            $"/users/{last.Id}/roles/{RoleName.Administrator}",
            ct
        );
        Assert.Equal(HttpStatusCode.Forbidden, refused.StatusCode);

        // Endpoints stop every sequential path first, so the backstop is called directly.
        await using var scope = app.Services.CreateAsyncScope();
        var identity = scope.ServiceProvider.GetRequiredService<IdentityService>();
        var id = Guid.Parse(last.Id);
        Assert.Equal(
            ErrorType.Conflict,
            (await identity.RemoveUserRole(id, RoleName.Administrator, ct)).Error!.Type
        );
        Assert.Equal(
            ErrorType.Conflict,
            (await identity.ReplaceUserRoles(id, RoleName.Guest)).Error!.Type
        );
        Assert.Equal(ErrorType.Conflict, (await identity.DeleteUser(id, ct)).Error!.Type);
        await AssertRoles(app, last.Id, [RoleName.Administrator]);
    }

    [Fact]
    public async Task Assignments_ListActiveManagerAndDeputyRecordsAndCountClosedHistory()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var target = Guid.Parse(
            (await TestUsers.Create(app, "target@example.invalid", RoleName.CruiseManager)).Id
        );
        var other = Guid.Parse(
            (await TestUsers.Create(app, "other@example.invalid", RoleName.CruiseManager)).Id
        );
        await TestUsers.Create(app, "actor@example.invalid", RoleName.Shipowner);
        var leads = Application(CruiseApplicationStatus.FormBRequired, target, other);
        var deputizes = Application(CruiseApplicationStatus.Undertaken, other, target);
        var cruise = Cruise(CruiseStatus.Confirmed, other, target);
        await app.InDatabase(async db =>
        {
            db.CruiseApplications.AddRange(
                leads,
                deputizes,
                Application(CruiseApplicationStatus.Reported, target, other),
                Application(CruiseApplicationStatus.Denied, other, target),
                Application(CruiseApplicationStatus.FormBRequired, other, Guid.Empty)
            );
            db.Cruises.AddRange(
                cruise,
                Cruise(CruiseStatus.Ended, target, other),
                Cruise(CruiseStatus.New, other, Guid.Empty)
            );
            await db.SaveChangesAsync(ct);
        });
        using var client = await TestApplications.Login(app, "actor@example.invalid");
        var assignments = await client.GetFromJsonAsync<UserAssignmentsResponse>(
            $"/users/{target}/assignments",
            new JsonSerializerOptions(JsonSerializerDefaults.Web)
            {
                Converters = { new JsonStringEnumConverter() },
            },
            ct
        );
        Assert.Equal(
            [
                (leads.Id, false, CruiseApplicationStatus.FormBRequired),
                (deputizes.Id, true, CruiseApplicationStatus.Undertaken),
            ],
            assignments!
                .Applications.Select(a => (a.Id, a.IsDeputy, a.Status))
                .OrderBy(a => a.IsDeputy)
        );
        var assignedCruise = Assert.Single(assignments.Cruises);
        Assert.Equal((cruise.Id, true), (assignedCruise.Id, assignedCruise.IsDeputy));
        Assert.Equal(3, assignments.ClosedCount);
    }

    private static CruiseApplication Application(
        CruiseApplicationStatus status,
        Guid manager,
        Guid deputy
    ) =>
        new()
        {
            Date = new DateOnly(2030, 1, 15),
            Status = status,
            FormA = new FormA
            {
                CruiseManagerId = manager,
                DeputyManagerId = deputy,
                Year = "2030",
                CruiseHours = "24",
                PeriodNotes = "",
                DifferentUsage = "",
                CruiseGoalDescription = "",
                SupervisorEmail = "supervisor@example.invalid",
            },
        };

    private static Cruise Cruise(CruiseStatus status, Guid manager, Guid deputy) =>
        new()
        {
            Number = $"2030/{status}",
            MainCruiseManagerId = manager,
            MainDeputyManagerId = deputy,
            StartDate = "2030-01-15T08:00:00.000Z",
            EndDate = "2030-01-16T08:00:00.000Z",
            Status = status,
            CruiseApplications = [],
        };

    private static async Task AssertRoles(TestApplication app, string userId, string[] expected)
    {
        var ct = TestContext.Current.CancellationToken;
        await app.InDatabase(async db =>
        {
            var names = await (
                from membership in db.UserRoles
                join role in db.Roles on membership.RoleId equals role.Id
                where membership.UserId == userId
                orderby role.Name
                select role.Name
            ).ToArrayAsync(ct);
            Assert.Equal(expected, names);
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
    }
}
