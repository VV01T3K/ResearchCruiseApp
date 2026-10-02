using System.Net;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Applications;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class OfficeDecisionTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    // BE-DECISION-001: an omitted decision cannot be interpreted as office rejection.
    [Fact]
    public async Task Decide_WhenAcceptIsMissing_RejectsWithoutChangingApplication()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var application = await TestApplications.Create(
            app,
            CruiseApplicationStatus.AcceptedBySupervisor
        );
        var office = await TestUsers.Create(app, "office@example.invalid", RoleName.Administrator);
        using var client = await TestApplications.Login(app, office.Email!);
        var route = $"/v2/applications/{application.Id}/decision";
        using var response = await client.PutAsJsonAsync(route, new { }, ct);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        await app.InDatabase(async db =>
        {
            Assert.Equal(
                CruiseApplicationStatus.AcceptedBySupervisor,
                (await db.CruiseApplications.SingleAsync(ct)).Status
            );
            Assert.Single(await db.FormsA.ToListAsync(ct));
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        using var accepted = await client.PutAsJsonAsync(
            route,
            new ApplicationDecisionRequest(true),
            ct
        );
        Assert.Equal(HttpStatusCode.NoContent, accepted.StatusCode);
        await app.InDatabase(async db =>
        {
            Assert.Equal(
                CruiseApplicationStatus.Accepted,
                (await db.CruiseApplications.SingleAsync(ct)).Status
            );
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        Assert.Empty(app.Transport.Messages);
    }
}
