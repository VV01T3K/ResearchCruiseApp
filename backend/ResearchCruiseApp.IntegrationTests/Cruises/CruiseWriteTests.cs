using System.Net;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Cruises;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Cruises;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class CruiseWriteTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    // BE-CRUISE-ACCESS-001: all mutation routes reject anonymous and non-office roles.
    [Theory]
    [InlineData("anonymous", HttpStatusCode.Unauthorized)]
    [InlineData(RoleName.Guest, HttpStatusCode.Forbidden)]
    [InlineData(RoleName.CruiseManager, HttpStatusCode.Forbidden)]
    [InlineData(RoleName.ShipCrew, HttpStatusCode.Forbidden)]
    public async Task MutateCruise_WhenActorHasNoOfficeRole_DeniesAllOperationsWithoutChanges(
        string role,
        HttpStatusCode expected
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var id = await CreateCruise(app);
        using var client =
            role == "anonymous"
                ? app.CreateApiClient()
                : await TestApplications.Login(
                    app,
                    (await TestUsers.Create(app, "actor@example.invalid", role)).Email!
                );
        var route = $"/v2/cruises/{id}";
        using var created = await client.PostAsJsonAsync(
            "/v2/cruises",
            new CreateRequest(
                "2030-07-01",
                "2030-07-02",
                Guid.Empty,
                Guid.Empty,
                [],
                "Denied",
                false
            ),
            ct
        );
        Assert.Equal(expected, created.StatusCode);
        await AssertUnchanged(app, id);
        using var updated = await client.PatchAsJsonAsync(
            route,
            new UpdateRequest(
                "2030-07-01",
                "2030-07-02",
                Guid.Empty,
                Guid.Empty,
                [],
                "Denied",
                false
            ),
            ct
        );
        Assert.Equal(expected, updated.StatusCode);
        await AssertUnchanged(app, id);
        using var confirmed = await client.PutAsync(route + "/confirmation", null, ct);
        Assert.Equal(expected, confirmed.StatusCode);
        await AssertUnchanged(app, id);
        using var completed = await client.PutAsync(route + "/completion", null, ct);
        Assert.Equal(expected, completed.StatusCode);
        await AssertUnchanged(app, id);
        using var reverted = await client.DeleteAsync(route + "/confirmation", ct);
        Assert.Equal(expected, reverted.StatusCode);
        await AssertUnchanged(app, id);
        using var deleted = await client.DeleteAsync(route, ct);
        Assert.Equal(expected, deleted.StatusCode);
        await AssertUnchanged(app, id);
        Assert.Empty(app.Transport.Messages);
    }

    // BE-ATOMIC-002: returned manager validation errors do not commit earlier tracked edits.
    [Fact]
    public async Task UpdateCruise_WhenManagerDoesNotExist_PreservesDatesTitleAndAssignments()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var id = await CreateCruise(app);
        var office = await TestUsers.Create(app, "office@example.invalid", RoleName.Administrator);
        using var client = await TestApplications.Login(app, office.Email!);
        var route = $"/v2/cruises/{id}";

        using var rejected = await client.PatchAsJsonAsync(
            route,
            new UpdateRequest(
                "2030-07-01",
                "2030-07-02",
                Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                Guid.Empty,
                [],
                "Changed",
                false
            ),
            ct
        );

        Assert.Equal(HttpStatusCode.NotFound, rejected.StatusCode);
        await AssertUnchanged(app, id);
        Assert.Empty(app.Transport.Messages);

        using var accepted = await client.PatchAsJsonAsync(
            route,
            new UpdateRequest(
                "2030-07-01",
                "2030-07-02",
                Guid.Empty,
                Guid.Empty,
                [],
                "Changed",
                false
            ),
            ct
        );
        Assert.Equal(HttpStatusCode.NoContent, accepted.StatusCode);
        await app.InDatabase(async db =>
        {
            var cruise = Assert.Single(
                await db.Cruises.Include(row => row.CruiseApplications).ToListAsync(ct)
            );
            Assert.Equal(id, cruise.Id);
            Assert.Equal("Changed", cruise.Title);
            Assert.Equal("2030-07-01", cruise.StartDate);
            Assert.Equal("2030-07-02", cruise.EndDate);
            Assert.Empty(cruise.CruiseApplications);
            var application = await db
                .CruiseApplications.Include(row => row.Cruise)
                .SingleAsync(ct);
            Assert.Equal(CruiseApplicationStatus.Accepted, application.Status);
            Assert.Null(application.Cruise);
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
    }

    private static async Task<Guid> CreateCruise(TestApplication app)
    {
        var application = await TestApplications.Create(app, CruiseApplicationStatus.Accepted);
        var cruise = new Cruise
        {
            Number = "2030/1",
            StartDate = "2030-06-01",
            EndDate = "2030-06-02",
            Status = CruiseStatus.New,
            Title = "Original",
            CruiseApplications = [],
        };
        await app.InDatabase(async db =>
        {
            cruise.CruiseApplications.Add(
                await db.CruiseApplications.SingleAsync(
                    row => row.Id == application.Id,
                    TestContext.Current.CancellationToken
                )
            );
            db.Cruises.Add(cruise);
            await db.SaveChangesAsync(TestContext.Current.CancellationToken);
        });
        return cruise.Id;
    }

    private static async Task AssertUnchanged(TestApplication app, Guid id)
    {
        var ct = TestContext.Current.CancellationToken;
        await app.InDatabase(async db =>
        {
            var cruise = Assert.Single(
                await db.Cruises.Include(row => row.CruiseApplications).ToListAsync(ct)
            );
            Assert.Equal(id, cruise.Id);
            Assert.Equal(CruiseStatus.New, cruise.Status);
            Assert.Equal("Original", cruise.Title);
            Assert.Equal("2030-06-01", cruise.StartDate);
            Assert.Equal("2030-06-02", cruise.EndDate);
            Assert.Equal(Guid.Empty, cruise.MainCruiseManagerId);
            Assert.Equal(Guid.Empty, cruise.MainDeputyManagerId);
            Assert.Equal(
                CruiseApplicationStatus.Accepted,
                Assert.Single(cruise.CruiseApplications).Status
            );
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
    }
}
