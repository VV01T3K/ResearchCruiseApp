using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Api;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Cruises;

public sealed partial class CruiseStatusTransitionTests
{
    private const string ConcurrentChange = Revisions.StaleMessage;

    [Fact]
    public async Task UndoCompletion_WhileFormCIsSubmitted_IsRejectedAndKeepsTheReport()
    {
        var ct = TestContext.Current.CancellationToken;
        var gate = new SaveChangesGate();
        await using var app = new TestApplication(fixture.ConnectionString, interceptor: gate);
        var office = await Office(app);
        var application = await Accepted(app, "manager@example.invalid");
        var cruiseId = await PostCruise(app, office, "Race", application.Id);
        Assert.Equal(HttpStatusCode.NoContent, await Confirm(office, cruiseId));
        await SubmitFormB(app, application);
        Assert.Equal(HttpStatusCode.NoContent, await Complete(office, cruiseId));
        using var manager = await TestApplications.Login(app, application.OwnerEmail);

        gate.Hold(db => SavesStatus(db, application.Id, CruiseApplicationStatus.Reported));
        var (formC, undo) = await gate.Race(
            fixture.ConnectionString,
            SendFormC(manager, application),
            () => RevertResponse(office, cruiseId),
            ct
        );

        using (formC)
            Assert.Equal(HttpStatusCode.OK, formC.StatusCode);
        await AssertConflict(undo);
        await AssertCruise(app, cruiseId, CruiseStatus.Ended);
        await AssertApplication(
            app,
            application.Id,
            CruiseApplicationStatus.Reported,
            cruiseId,
            formB: true,
            formC: true,
            points: 200
        );
        await AssertRejected(await RevertResponse(office, cruiseId), ReportedBlocksRevert);
    }

    [Fact]
    public async Task RemoveFromConfirmedCruise_WhileFormBIsSubmitted_IsRejectedAndKeepsIt()
    {
        var gate = new SaveChangesGate();
        await using var app = new TestApplication(fixture.ConnectionString, interceptor: gate);
        var office = await Office(app);
        var application = await Accepted(app, "manager@example.invalid");
        var cruiseId = await PostCruise(app, office, "Race", application.Id);
        Assert.Equal(HttpStatusCode.NoContent, await Confirm(office, cruiseId));
        using var manager = await TestApplications.Login(app, application.OwnerEmail);

        gate.Hold(db => SavesStatus(db, application.Id, CruiseApplicationStatus.FormBFilled));
        var (formB, removal) = await gate.Race(
            fixture.ConnectionString,
            SendFormB(manager, application),
            () => PatchResponse(office, cruiseId, []),
            TestContext.Current.CancellationToken
        );

        using (formB)
            Assert.Equal(HttpStatusCode.OK, formB.StatusCode);
        await AssertConflict(removal);
        await AssertApplication(
            app,
            application.Id,
            CruiseApplicationStatus.FormBFilled,
            cruiseId,
            formB: true
        );
        Assert.Equal(HttpStatusCode.OK, await Patch(office, cruiseId, []));
        await AssertApplication(
            app,
            application.Id,
            CruiseApplicationStatus.Accepted,
            null,
            formB: true
        );
    }

    [Fact]
    public async Task OpposingOfficeDecisions_WhenTheyOverlap_RejectTheSecondQuietly()
    {
        var gate = new SaveChangesGate();
        await using var app = new TestApplication(fixture.ConnectionString, interceptor: gate);
        var office = await Office(app);
        var (id, _) = await TestApplications.Create(
            app,
            CruiseApplicationStatus.AcceptedBySupervisor
        );
        Task<HttpResponseMessage> Decide(bool accept) =>
            office.PutAsJsonAsync($"/v2/applications/{id}/decision", new { Accept = accept });

        gate.Hold(db => SavesStatus(db, id, CruiseApplicationStatus.Accepted));
        var (accepted, rejected) = await gate.Race(
            fixture.ConnectionString,
            Decide(true),
            () => Decide(false),
            TestContext.Current.CancellationToken
        );

        using (accepted)
            Assert.Equal(HttpStatusCode.NoContent, accepted.StatusCode);
        await AssertConflict(rejected);
    }

    private static bool SavesStatus(
        DbContext db,
        Guid applicationId,
        CruiseApplicationStatus status
    ) =>
        db
            .ChangeTracker.Entries<CruiseApplication>()
            .Any(entry =>
                entry.Entity.Id == applicationId
                && entry.Entity.Status == status
                && entry.Property(row => row.Status).IsModified
            );

    private static async Task AssertConflict(HttpResponseMessage response)
    {
        using (response)
        {
            Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
            var problem = await response.Content.ReadFromJsonAsync<JsonElement>(
                TestContext.Current.CancellationToken
            );
            Assert.Equal(ConcurrentChange, problem.GetProperty("detail").GetString());
        }
    }
}
