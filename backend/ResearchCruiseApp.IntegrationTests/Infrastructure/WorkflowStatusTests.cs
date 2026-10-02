using System.Net;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.IntegrationTests.Infrastructure;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class WorkflowStatusTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    // BE-INFRA-003: assert the actual SQL-backed response, including production serialization.
    [Theory]
    [InlineData(CruiseApplicationStatus.Draft, "draft")]
    [InlineData(CruiseApplicationStatus.WaitingForSupervisor, "waitingForSupervisor")]
    [InlineData(CruiseApplicationStatus.AcceptedBySupervisor, "acceptedBySupervisor")]
    [InlineData(CruiseApplicationStatus.DeniedBySupervisor, "deniedBySupervisor")]
    [InlineData(CruiseApplicationStatus.Accepted, "accepted")]
    [InlineData(CruiseApplicationStatus.Denied, "denied")]
    [InlineData(CruiseApplicationStatus.FormBRequired, "formBRequired")]
    [InlineData(CruiseApplicationStatus.FormBFilled, "formBFilled")]
    [InlineData(CruiseApplicationStatus.Undertaken, "undertaken")]
    [InlineData(CruiseApplicationStatus.Reported, "reported")]
    public async Task Application_WhenRead_ReturnsStableStatusCode(
        CruiseApplicationStatus status,
        string code
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var application = await TestApplications.Create(app, status);
        Guid formId = default;
        await app.InDatabase(async db => formId = (await db.FormsA.SingleAsync(ct)).Id);
        using var client = await TestApplications.Login(app, application.OwnerEmail);
        using var response = await client.GetAsync($"/v2/applications/{application.Id}", ct);
        await AssertResponse(response, application.Id, code);
        await app.InDatabase(async db =>
        {
            var stored = await db.CruiseApplications.Include(row => row.FormA).SingleAsync(ct);
            Assert.Equal(application.Id, stored.Id);
            Assert.Equal(status, stored.Status);
            Assert.Equal(formId, stored.FormA!.Id);
            Assert.Equal(new DateOnly(2030, 1, 15), stored.Date);
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        await app.Dispatch(ct);
        Assert.Empty(app.Transport.Messages);
    }

    [Theory]
    [InlineData(CruiseStatus.New, "new")]
    [InlineData(CruiseStatus.Confirmed, "confirmed")]
    [InlineData(CruiseStatus.Ended, "ended")]
    public async Task Cruise_WhenRead_ReturnsStableStatusCode(CruiseStatus status, string code)
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var manager = await TestUsers.Create(
            app,
            "status-manager@example.invalid",
            RoleName.CruiseManager
        );
        var cruise = new Cruise
        {
            Number = "1/2030",
            MainCruiseManagerId = Guid.Parse(manager.Id),
            StartDate = "2030-06-01T08:00:00",
            EndDate = "2030-06-02T08:00:00",
            Status = status,
            Title = "Status fixture",
            CruiseApplications = [],
        };
        await app.InDatabase(async db =>
        {
            db.Cruises.Add(cruise);
            await db.SaveChangesAsync(ct);
        });
        var office = await TestUsers.Create(
            app,
            "status-office@example.invalid",
            RoleName.Shipowner
        );
        using var client = await TestApplications.Login(app, office.Email!);
        using var response = await client.GetAsync($"/v2/cruises/{cruise.Id}", ct);
        await AssertResponse(response, cruise.Id, code);
        await app.InDatabase(async db =>
        {
            var stored = await db.Cruises.Include(row => row.CruiseApplications).SingleAsync(ct);
            Assert.Equal(cruise.Id, stored.Id);
            Assert.Equal(status, stored.Status);
            Assert.Equal(cruise.Number, stored.Number);
            Assert.Equal(cruise.MainCruiseManagerId, stored.MainCruiseManagerId);
            Assert.Equal(cruise.StartDate, stored.StartDate);
            Assert.Equal(cruise.EndDate, stored.EndDate);
            Assert.Empty(stored.CruiseApplications);
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        await app.Dispatch(ct);
        Assert.Empty(app.Transport.Messages);
    }

    private static async Task AssertResponse(HttpResponseMessage response, Guid id, string code)
    {
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("application/json", response.Content.Headers.ContentType?.MediaType);
        using var body = await JsonDocument.ParseAsync(
            await response.Content.ReadAsStreamAsync(TestContext.Current.CancellationToken),
            cancellationToken: TestContext.Current.CancellationToken
        );
        Assert.Equal(id, body.RootElement.GetProperty("id").GetGuid());
        Assert.Equal(code, body.RootElement.GetProperty("status").GetString());
    }
}
