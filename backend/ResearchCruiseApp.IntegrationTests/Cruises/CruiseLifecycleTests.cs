using System.Net;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Api.Cruises;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Cruises;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class CruiseLifecycleTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    // BE-CRUISE-001: planning, confirmation and completion propagate to the assigned application.
    [Fact]
    public async Task Cruise_WhenPlannedConfirmedCompletedAndReverted_PersistsLifecycleAndNotification()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var application = await TestApplications.Create(app, CruiseApplicationStatus.Accepted);
        var office = await TestUsers.Create(app, "planner@example.invalid", RoleName.Shipowner);
        using var client = await TestApplications.Login(app, office.Email!);
        Guid managerId = default;
        await app.InDatabase(async db =>
            managerId = (await db.FormsA.SingleAsync(ct)).CruiseManagerId
        );

        using var created = await client.PostAsJsonAsync(
            "/v2/cruises",
            new CreateRequest(
                "2030-06-01",
                "2030-06-02",
                managerId,
                Guid.Empty,
                [application.Id],
                "Research",
                false
            ),
            ct
        );
        Assert.Equal(HttpStatusCode.Created, created.StatusCode);
        Guid cruiseId = default;
        await app.InDatabase(async db =>
        {
            var cruise = Assert.Single(
                await db.Cruises.Include(row => row.CruiseApplications).ToListAsync(ct)
            );
            cruiseId = cruise.Id;
            Assert.Equal(CruiseStatus.New, cruise.Status);
            Assert.Equal(application.Id, Assert.Single(cruise.CruiseApplications).Id);
            Assert.Equal(managerId, cruise.MainCruiseManagerId);
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        var route = $"/v2/cruises/{cruiseId}";
        using var premature = await client.PutAsync(route + "/completion", null, ct);
        Assert.Equal(HttpStatusCode.BadRequest, premature.StatusCode);
        await AssertState(app, CruiseStatus.New, CruiseApplicationStatus.Accepted, 0);

        using var confirmed = await client.PutAsync(route + "/confirmation", null, ct);
        Assert.Equal(HttpStatusCode.NoContent, confirmed.StatusCode);
        await AssertState(app, CruiseStatus.Confirmed, CruiseApplicationStatus.FormBRequired, 1);
        using var repeated = await client.PutAsync(route + "/confirmation", null, ct);
        Assert.Equal(HttpStatusCode.Forbidden, repeated.StatusCode);
        await AssertState(app, CruiseStatus.Confirmed, CruiseApplicationStatus.FormBRequired, 1);
        await app.Dispatch(ct);
        Assert.Equal(
            application.OwnerEmail,
            Assert.Single(app.Transport.Messages).Payload.Recipient
        );

        using var manager = await TestApplications.Login(app, application.OwnerEmail);
        using var submitted = await manager.PutAsJsonAsync(
            $"/v2/applications/{application.Id}/form-b",
            new FormBWriteRequest
            {
                Form = new FormBFields { IsCruiseManagerPresent = "true" },
                Draft = false,
            },
            ct
        );
        Assert.Equal(HttpStatusCode.Created, submitted.StatusCode);
        await AssertState(app, CruiseStatus.Confirmed, CruiseApplicationStatus.FormBFilled, 0);

        using var completed = await client.PutAsync(route + "/completion", null, ct);
        Assert.Equal(HttpStatusCode.NoContent, completed.StatusCode);
        await AssertState(app, CruiseStatus.Ended, CruiseApplicationStatus.Undertaken, 0);
        using var duplicate = await client.PutAsync(route + "/completion", null, ct);
        Assert.Equal(HttpStatusCode.BadRequest, duplicate.StatusCode);
        await AssertState(app, CruiseStatus.Ended, CruiseApplicationStatus.Undertaken, 0);

        using var reverted = await client.DeleteAsync(route + "/confirmation", ct);
        Assert.Equal(HttpStatusCode.NoContent, reverted.StatusCode);
        await AssertState(app, CruiseStatus.Confirmed, CruiseApplicationStatus.FormBFilled, 0);
        Assert.Single(app.Transport.Messages);
    }

    private static async Task AssertState(
        TestApplication app,
        CruiseStatus cruise,
        CruiseApplicationStatus application,
        int emails
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await app.InDatabase(async db =>
        {
            Assert.Equal(cruise, (await db.Cruises.SingleAsync(ct)).Status);
            Assert.Equal(application, (await db.CruiseApplications.SingleAsync(ct)).Status);
            Assert.Equal(emails, await db.EmailOutboxMessages.CountAsync(ct));
        });
    }
}
