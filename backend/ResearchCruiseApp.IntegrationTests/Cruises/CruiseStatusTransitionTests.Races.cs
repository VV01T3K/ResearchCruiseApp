using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.IntegrationTests.Infrastructure;
using DomainCruise = ResearchCruiseApp.Domain.Entities.Cruise;

namespace ResearchCruiseApp.IntegrationTests.Cruises;

// Two requests acting on the same cruise at once. The first is held after it has checked its
// state; the second then checks the same state and must not commit on top of the first.
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
            points: 400
        );
        await AssertRejected(await RevertResponse(office, cruiseId), ReportedBlocksRevert);
    }

    [Fact]
    public async Task AddToConfirmedCruise_WhileConfirmationIsUndone_IsRejected()
    {
        var gate = new SaveChangesGate();
        await using var app = new TestApplication(fixture.ConnectionString, interceptor: gate);
        var office = await Office(app);
        var existing = await Accepted(app, "existing@example.invalid");
        var added = await Accepted(app, "added@example.invalid");
        var cruiseId = await PostCruise(app, office, "Race", existing.Id);
        Assert.Equal(HttpStatusCode.NoContent, await Confirm(office, cruiseId));
        var pendingBefore = await PendingEmails(app);

        gate.Hold(db => SavesStatus(db, cruiseId, CruiseStatus.New));
        var (undo, add) = await gate.Race(
            fixture.ConnectionString,
            RevertResponse(office, cruiseId),
            () => PatchResponse(office, cruiseId, [existing.Id, added.Id]),
            TestContext.Current.CancellationToken
        );

        using (undo)
            Assert.Equal(HttpStatusCode.NoContent, undo.StatusCode);
        await AssertConflict(add);
        await AssertCruise(app, cruiseId, CruiseStatus.New);
        await AssertApplication(app, existing.Id, CruiseApplicationStatus.Accepted, cruiseId);
        await AssertApplication(app, added.Id, CruiseApplicationStatus.Accepted, null);
        Assert.Equal(pendingBefore, await PendingEmails(app));
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

    [Fact]
    public async Task RemoveFromConfirmedCruise_WhileItIsCompleted_IsRejected()
    {
        var ct = TestContext.Current.CancellationToken;
        var gate = new SaveChangesGate();
        await using var app = new TestApplication(fixture.ConnectionString, interceptor: gate);
        var office = await Office(app);
        var application = await Accepted(app, "manager@example.invalid");
        var cruiseId = await PostCruise(app, office, "Race", application.Id);
        Assert.Equal(HttpStatusCode.NoContent, await Confirm(office, cruiseId));
        await SubmitFormB(app, application);

        gate.Hold(db => SavesStatus(db, cruiseId, CruiseStatus.Ended));
        var (completion, removal) = await gate.Race(
            fixture.ConnectionString,
            office.PutAsync($"/v2/cruises/{cruiseId}/completion", null, ct),
            () => PatchResponse(office, cruiseId, []),
            ct
        );

        using (completion)
            Assert.Equal(HttpStatusCode.NoContent, completion.StatusCode);
        await AssertConflict(removal);
        await AssertCruise(app, cruiseId, CruiseStatus.Ended);
        await AssertApplication(
            app,
            application.Id,
            CruiseApplicationStatus.Undertaken,
            cruiseId,
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

    private static bool SavesStatus(DbContext db, Guid cruiseId, CruiseStatus status) =>
        db
            .ChangeTracker.Entries<DomainCruise>()
            .Any(entry =>
                entry.Entity.Id == cruiseId
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
