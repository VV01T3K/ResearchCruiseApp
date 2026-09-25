using System.Net;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Auth;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class RoleManagementTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    // BE-ROLES-001: route permissions and shipowner escalation limits preserve membership.
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
            $"/v2/users/{target.Id}/roles/{requestedRole}",
            null,
            ct
        );
        Assert.Equal(expected, response.StatusCode);
        await AssertRoles(app, target.Id, [RoleName.CruiseManager]);
        Assert.Empty(app.Transport.Messages);
    }

    // BE-ROLES-002: both office roles can grant and remove a lower role without losing others.
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
        var route = $"/v2/users/{target.Id}/roles/{RoleName.Guest}";
        using var granted = await client.PutAsync(route, null, ct);
        Assert.Equal(HttpStatusCode.NoContent, granted.StatusCode);
        await AssertRoles(app, target.Id, [RoleName.CruiseManager, RoleName.Guest]);
        using var removed = await client.DeleteAsync(route, ct);
        Assert.Equal(HttpStatusCode.NoContent, removed.StatusCode);
        await AssertRoles(app, target.Id, [RoleName.CruiseManager]);
        Assert.Empty(app.Transport.Messages);
    }

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
