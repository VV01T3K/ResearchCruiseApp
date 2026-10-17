using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Cruises;

public sealed partial class CruiseStatusTransitionTests
{
    private const string ConcurrentChange =
        "Dane zostały w międzyczasie zmienione przez inną operację. Odśwież stronę i spróbuj ponownie.";

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
            Assert.Equal(HttpStatusCode.Created, formC.StatusCode);
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
            Assert.Equal(HttpStatusCode.Created, formB.StatusCode);
        await AssertConflict(removal);
        await AssertApplication(
            app,
            application.Id,
            CruiseApplicationStatus.FormBFilled,
            cruiseId,
            formB: true
        );
        Assert.Equal(HttpStatusCode.NoContent, await Patch(office, cruiseId, []));
        await AssertApplication(
            app,
            application.Id,
            CruiseApplicationStatus.Accepted,
            null,
            formB: true
        );
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
