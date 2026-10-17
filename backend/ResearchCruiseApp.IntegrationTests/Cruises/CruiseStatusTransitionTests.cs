using System.Net;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Api.Cruises;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Cruises;

// Reproductions for #467, #468 and #469. Each test pins the behaviour that staging has
// today, not the intended behaviour: the product owner has not chosen a policy yet. A
// test failing here means the behaviour changed and the assertion should be replaced
// by the agreed outcome.
[Collection(SqlTestCollectionDefinition.Name)]
public sealed class CruiseStatusReproductionTests(SqlFixture fixture) : IAsyncLifetime
{
    private const string ConfirmationSubject = "Rejs zaakceptowany";

    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    // #467
    [Fact]
    public async Task RemoveFromConfirmedCruise_CurrentBehaviour_StrandsFormBStatusesAndBlocksReplanning()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var office = await Office(app);
        var required = await Accepted(app, "required@example.invalid");
        var filled = await Accepted(app, "filled@example.invalid");
        var cruiseId = await PostCruise(app, office, "Confirmed", required.Id, filled.Id);
        Assert.Equal(HttpStatusCode.NoContent, await Confirm(office, cruiseId));
        await SubmitFormB(app, filled);
        await AssertApplication(app, required.Id, CruiseApplicationStatus.FormBRequired, cruiseId);
        await AssertApplication(
            app,
            filled.Id,
            CruiseApplicationStatus.FormBFilled,
            cruiseId,
            formB: true
        );
        var pendingBefore = await PendingEmails(app);

        Assert.Equal(HttpStatusCode.NoContent, await Patch(office, cruiseId, []));

        await AssertCruise(app, cruiseId, CruiseStatus.Confirmed);
        await AssertApplication(app, required.Id, CruiseApplicationStatus.FormBRequired, null);
        await AssertApplication(
            app,
            filled.Id,
            CruiseApplicationStatus.FormBFilled,
            null,
            formB: true
        );
        Assert.Equal(pendingBefore, await PendingEmails(app));

        // Neither removed application can be planned again.
        Assert.Empty(await PlanningCandidates(office, null));
        var otherId = await PostCruise(app, office, "Other");
        Assert.Equal(HttpStatusCode.BadRequest, await Patch(office, otherId, [required.Id]));
        Assert.Equal(HttpStatusCode.BadRequest, await Patch(office, otherId, [filled.Id]));
        using var created = await office.PostAsJsonAsync(
            "/v2/cruises",
            new CreateRequest(
                "2030-08-01",
                "2030-08-02",
                Guid.Empty,
                Guid.Empty,
                [required.Id],
                "Rejected",
                false
            ),
            ct
        );
        Assert.Equal(HttpStatusCode.BadRequest, created.StatusCode);
        // The office cannot re-accept them either.
        Assert.Equal(HttpStatusCode.Forbidden, await Decide(office, required.Id));
        Assert.Equal(HttpStatusCode.Forbidden, await Decide(office, filled.Id));

        // Form B can still be submitted for the cruise-less application.
        await SubmitFormB(app, required);
        await AssertApplication(
            app,
            required.Id,
            CruiseApplicationStatus.FormBFilled,
            null,
            formB: true
        );
        Assert.Equal(pendingBefore, await PendingEmails(app));
    }

    // #467
    [Fact]
    public async Task RemoveFromEndedCruise_CurrentBehaviour_StrandsUndertakenAndReportedWithPoints()
    {
        await using var app = new TestApplication(fixture.ConnectionString);
        var office = await Office(app);
        var undertaken = await Accepted(app, "undertaken@example.invalid");
        var reported = await Accepted(app, "reported@example.invalid");
        var cruiseId = await PostCruise(app, office, "Ended", undertaken.Id, reported.Id);
        Assert.Equal(HttpStatusCode.NoContent, await Confirm(office, cruiseId));
        await SubmitFormB(app, undertaken);
        await SubmitFormB(app, reported);
        Assert.Equal(HttpStatusCode.NoContent, await Complete(office, cruiseId));
        Assert.Equal(HttpStatusCode.Created, await SubmitFormC(app, reported));
        await AssertApplication(
            app,
            undertaken.Id,
            CruiseApplicationStatus.Undertaken,
            cruiseId,
            formB: true
        );
        await AssertApplication(
            app,
            reported.Id,
            CruiseApplicationStatus.Reported,
            cruiseId,
            formB: true,
            formC: true,
            points: 400
        );
        var pendingBefore = await PendingEmails(app);

        Assert.Equal(HttpStatusCode.NoContent, await Patch(office, cruiseId, []));

        await AssertCruise(app, cruiseId, CruiseStatus.Ended);
        await AssertApplication(
            app,
            undertaken.Id,
            CruiseApplicationStatus.Undertaken,
            null,
            formB: true
        );
        await AssertApplication(
            app,
            reported.Id,
            CruiseApplicationStatus.Reported,
            null,
            formB: true,
            formC: true,
            points: 400
        );
        Assert.Equal(pendingBefore, await PendingEmails(app));

        Assert.Empty(await PlanningCandidates(office, null));
        var otherId = await PostCruise(app, office, "Other");
        Assert.Equal(HttpStatusCode.BadRequest, await Patch(office, otherId, [undertaken.Id]));
        Assert.Equal(HttpStatusCode.BadRequest, await Patch(office, otherId, [reported.Id]));

        // Form C can still be submitted, and points awarded, without any cruise.
        Assert.Equal(HttpStatusCode.Created, await SubmitFormC(app, undertaken));
        await AssertApplication(
            app,
            undertaken.Id,
            CruiseApplicationStatus.Reported,
            null,
            formB: true,
            formC: true,
            points: 400
        );
    }

    // #468
    [Fact]
    public async Task UpdateEndedCruise_CurrentBehaviour_AppliesChangesAndLeavesAddedApplicationAccepted()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var office = await Office(app);
        var original = await Accepted(app, "original@example.invalid");
        var late = await Accepted(app, "late@example.invalid");
        var cruiseId = await PostCruise(app, office, "Ended", original.Id);
        Assert.Equal(HttpStatusCode.NoContent, await Confirm(office, cruiseId));
        await SubmitFormB(app, original);
        Assert.Equal(HttpStatusCode.NoContent, await Complete(office, cruiseId));
        var pendingBefore = await PendingEmails(app);

        using var updated = await office.PatchAsJsonAsync(
            $"/v2/cruises/{cruiseId}",
            new UpdateRequest(
                "2030-09-01",
                "2030-09-05",
                late.ManagerId,
                original.ManagerId,
                [original.Id, late.Id],
                "Edited after end",
                false
            ),
            ct
        );

        Assert.Equal(HttpStatusCode.NoContent, updated.StatusCode);
        await app.InDatabase(async db =>
        {
            var cruise = await db.Cruises.SingleAsync(row => row.Id == cruiseId, ct);
            Assert.Equal(CruiseStatus.Ended, cruise.Status);
            Assert.Equal("2030-09-01", cruise.StartDate);
            Assert.Equal("2030-09-05", cruise.EndDate);
            Assert.Equal("Edited after end", cruise.Title);
            Assert.Equal(late.ManagerId, cruise.MainCruiseManagerId);
            Assert.Equal(original.ManagerId, cruise.MainDeputyManagerId);
        });
        await AssertApplication(
            app,
            original.Id,
            CruiseApplicationStatus.Undertaken,
            cruiseId,
            formB: true
        );
        await AssertApplication(app, late.Id, CruiseApplicationStatus.Accepted, cruiseId);
        Assert.Equal(pendingBefore, await PendingEmails(app));

        // The added application cannot progress: no Form B, no Form C, no refill.
        Assert.Equal(HttpStatusCode.Forbidden, await SubmitFormBStatus(app, late));
        Assert.Equal(HttpStatusCode.Forbidden, await SubmitFormC(app, late));
        using var refill = await office.PutAsync(
            $"/v2/applications/{late.Id}/form-b/refill",
            null,
            ct
        );
        Assert.Equal(HttpStatusCode.Forbidden, refill.StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, await Decide(office, late.Id));
        await AssertApplication(app, late.Id, CruiseApplicationStatus.Accepted, cruiseId);

        // Reverting completion leaves it accepted on a confirmed cruise.
        Assert.Equal(HttpStatusCode.NoContent, await Revert(office, cruiseId));
        await AssertCruise(app, cruiseId, CruiseStatus.Confirmed);
        await AssertApplication(
            app,
            original.Id,
            CruiseApplicationStatus.FormBFilled,
            cruiseId,
            formB: true
        );
        await AssertApplication(app, late.Id, CruiseApplicationStatus.Accepted, cruiseId);

        // Saving the confirmed cruise again is the only way to request Form B, and it
        // sends no confirmation email.
        Assert.Equal(
            HttpStatusCode.NoContent,
            await Patch(office, cruiseId, [original.Id, late.Id])
        );
        await AssertApplication(app, late.Id, CruiseApplicationStatus.FormBRequired, cruiseId);
        Assert.Equal(pendingBefore, await PendingEmails(app));
    }

    // #469
    [Fact]
    public async Task ConfirmUndoConfirm_CurrentBehaviour_ResetsFilledFormBAndResendsEveryEmail()
    {
        await using var app = new TestApplication(fixture.ConnectionString);
        var office = await Office(app);
        var deputy = await TestUsers.Create(app, "deputy@example.invalid", RoleName.CruiseManager);
        var deputyId = Guid.Parse(deputy.Id);
        var required = await Accepted(app, "required@example.invalid", deputyId);
        var filled = await Accepted(app, "filled@example.invalid", deputyId);
        var cruiseId = await PostCruise(app, office, "Reconfirmed", required.Id, filled.Id);

        Assert.Equal(HttpStatusCode.NoContent, await Confirm(office, cruiseId));
        Assert.Equal(
            new Dictionary<string, int>
            {
                [deputy.Email!] = 2,
                [filled.OwnerEmail] = 1,
                [required.OwnerEmail] = 1,
            },
            await DispatchConfirmations(app)
        );
        await SubmitFormB(app, filled);

        Assert.Equal(HttpStatusCode.NoContent, await Revert(office, cruiseId));
        await AssertCruise(app, cruiseId, CruiseStatus.New);
        await AssertApplication(app, required.Id, CruiseApplicationStatus.Accepted, cruiseId);
        await AssertApplication(
            app,
            filled.Id,
            CruiseApplicationStatus.FormBFilled,
            cruiseId,
            formB: true
        );
        // Delivered messages leave the outbox, so this counts what the undo queued.
        Assert.Equal(0, await PendingEmails(app));

        Assert.Equal(HttpStatusCode.NoContent, await Confirm(office, cruiseId));
        await AssertCruise(app, cruiseId, CruiseStatus.Confirmed);
        await AssertApplication(app, required.Id, CruiseApplicationStatus.FormBRequired, cruiseId);
        await AssertApplication(
            app,
            filled.Id,
            CruiseApplicationStatus.FormBRequired,
            cruiseId,
            formB: true
        );
        Assert.Equal(4, await PendingEmails(app));
        Assert.Equal(
            new Dictionary<string, int>
            {
                [deputy.Email!] = 2,
                [filled.OwnerEmail] = 1,
                [required.OwnerEmail] = 1,
            },
            await DispatchConfirmations(app)
        );
    }

    // #469
    [Fact]
    public async Task CompleteUndoComplete_CurrentBehaviour_KeepsReportedFormCAndPointsThroughEveryRevert()
    {
        await using var app = new TestApplication(fixture.ConnectionString);
        var office = await Office(app);
        var undertaken = await Accepted(app, "undertaken@example.invalid");
        var reported = await Accepted(app, "reported@example.invalid");
        var cruiseId = await PostCruise(app, office, "Reverted", undertaken.Id, reported.Id);
        Assert.Equal(HttpStatusCode.NoContent, await Confirm(office, cruiseId));
        await SubmitFormB(app, undertaken);
        await SubmitFormB(app, reported);
        Assert.Equal(HttpStatusCode.NoContent, await Complete(office, cruiseId));
        Assert.Equal(HttpStatusCode.Created, await SubmitFormC(app, reported));
        await AssertApplication(
            app,
            reported.Id,
            CruiseApplicationStatus.Reported,
            cruiseId,
            formB: true,
            formC: true,
            points: 400
        );
        var pendingBefore = await PendingEmails(app);

        Assert.Equal(HttpStatusCode.NoContent, await Revert(office, cruiseId));
        await AssertCruise(app, cruiseId, CruiseStatus.Confirmed);
        await AssertApplication(
            app,
            undertaken.Id,
            CruiseApplicationStatus.FormBFilled,
            cruiseId,
            formB: true
        );
        await AssertApplication(
            app,
            reported.Id,
            CruiseApplicationStatus.Reported,
            cruiseId,
            formB: true,
            formC: true,
            points: 400
        );
        Assert.Equal(pendingBefore, await PendingEmails(app));

        Assert.Equal(HttpStatusCode.NoContent, await Complete(office, cruiseId));
        await AssertCruise(app, cruiseId, CruiseStatus.Ended);
        await AssertApplication(
            app,
            undertaken.Id,
            CruiseApplicationStatus.Undertaken,
            cruiseId,
            formB: true
        );
        await AssertApplication(
            app,
            reported.Id,
            CruiseApplicationStatus.Reported,
            cruiseId,
            formB: true,
            formC: true,
            points: 400
        );

        // Reverting twice returns the cruise to new with a reported application, and
        // confirming again demands Form B from it while its Form C and points remain.
        Assert.Equal(HttpStatusCode.NoContent, await Revert(office, cruiseId));
        Assert.Equal(HttpStatusCode.NoContent, await Revert(office, cruiseId));
        await AssertCruise(app, cruiseId, CruiseStatus.New);
        await AssertApplication(
            app,
            undertaken.Id,
            CruiseApplicationStatus.FormBFilled,
            cruiseId,
            formB: true
        );
        await AssertApplication(
            app,
            reported.Id,
            CruiseApplicationStatus.Reported,
            cruiseId,
            formB: true,
            formC: true,
            points: 400
        );
        Assert.Equal(pendingBefore, await PendingEmails(app));

        Assert.Equal(HttpStatusCode.NoContent, await Confirm(office, cruiseId));
        await AssertApplication(
            app,
            undertaken.Id,
            CruiseApplicationStatus.FormBRequired,
            cruiseId,
            formB: true
        );
        await AssertApplication(
            app,
            reported.Id,
            CruiseApplicationStatus.FormBRequired,
            cruiseId,
            formB: true,
            formC: true,
            points: 400
        );
        Assert.Equal(pendingBefore + 2, await PendingEmails(app));
    }

    [Fact]
    public async Task DeleteConfirmedCruise_CurrentBehaviour_ResetsToAcceptedButKeepsFormB()
    {
        await using var app = new TestApplication(fixture.ConnectionString);
        var office = await Office(app);
        var required = await Accepted(app, "required@example.invalid");
        var filled = await Accepted(app, "filled@example.invalid");
        var cruiseId = await PostCruise(app, office, "Deleted", required.Id, filled.Id);
        Assert.Equal(HttpStatusCode.NoContent, await Confirm(office, cruiseId));
        await SubmitFormB(app, filled);
        var pendingBefore = await PendingEmails(app);

        using var deleted = await office.DeleteAsync(
            $"/v2/cruises/{cruiseId}",
            TestContext.Current.CancellationToken
        );

        Assert.Equal(HttpStatusCode.NoContent, deleted.StatusCode);
        await AssertApplication(app, required.Id, CruiseApplicationStatus.Accepted, null);
        await AssertApplication(app, filled.Id, CruiseApplicationStatus.Accepted, null, true);
        Assert.Equal(pendingBefore, await PendingEmails(app));
        Assert.Equal(2, (await PlanningCandidates(office, null)).Count);

        // Re-planned and confirmed, the kept Form B must be submitted again.
        var nextId = await PostCruise(app, office, "Next", filled.Id);
        Assert.Equal(HttpStatusCode.NoContent, await Confirm(office, nextId));
        await AssertApplication(
            app,
            filled.Id,
            CruiseApplicationStatus.FormBRequired,
            nextId,
            true
        );
    }

    private sealed record Seeded(Guid Id, string OwnerEmail, Guid ManagerId);

    private static async Task<HttpClient> Office(TestApplication app) =>
        await TestApplications.Login(
            app,
            (await TestUsers.Create(app, "office@example.invalid", RoleName.Shipowner)).Email!
        );

    private static async Task<Seeded> Accepted(
        TestApplication app,
        string ownerEmail,
        Guid? deputyId = null
    )
    {
        var ct = TestContext.Current.CancellationToken;
        var (id, email) = await TestApplications.Create(
            app,
            CruiseApplicationStatus.Accepted,
            ownerEmail
        );
        Guid managerId = default;
        await app.InDatabase(async db =>
        {
            var formA = (
                await db
                    .CruiseApplications.Include(row => row.FormA)
                    .SingleAsync(row => row.Id == id, ct)
            ).FormA!;
            managerId = formA.CruiseManagerId;
            if (deputyId is not null)
                formA.DeputyManagerId = deputyId.Value;
            await db.SaveChangesAsync(ct);
        });
        return new Seeded(id, email, managerId);
    }

    private static async Task<Guid> PostCruise(
        TestApplication app,
        HttpClient office,
        string title,
        params Guid[] applicationIds
    )
    {
        var ct = TestContext.Current.CancellationToken;
        using var response = await office.PostAsJsonAsync(
            "/v2/cruises",
            new CreateRequest(
                "2030-06-01",
                "2030-06-02",
                Guid.Empty,
                Guid.Empty,
                [.. applicationIds],
                title,
                false
            ),
            ct
        );
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        Guid id = default;
        await app.InDatabase(async db =>
            id = (await db.Cruises.SingleAsync(row => row.Title == title, ct)).Id
        );
        return id;
    }

    private static async Task<HttpStatusCode> Patch(
        HttpClient office,
        Guid cruiseId,
        List<Guid> applicationIds
    )
    {
        using var response = await office.PatchAsJsonAsync(
            $"/v2/cruises/{cruiseId}",
            new UpdateRequest(
                "2030-06-01",
                "2030-06-02",
                Guid.Empty,
                Guid.Empty,
                applicationIds,
                "Edited",
                false
            ),
            TestContext.Current.CancellationToken
        );
        return response.StatusCode;
    }

    private static async Task<HttpStatusCode> Confirm(HttpClient office, Guid cruiseId)
    {
        using var response = await office.PutAsync(
            $"/v2/cruises/{cruiseId}/confirmation",
            null,
            TestContext.Current.CancellationToken
        );
        return response.StatusCode;
    }

    private static async Task<HttpStatusCode> Revert(HttpClient office, Guid cruiseId)
    {
        using var response = await office.DeleteAsync(
            $"/v2/cruises/{cruiseId}/confirmation",
            TestContext.Current.CancellationToken
        );
        return response.StatusCode;
    }

    private static async Task<HttpStatusCode> Complete(HttpClient office, Guid cruiseId)
    {
        using var response = await office.PutAsync(
            $"/v2/cruises/{cruiseId}/completion",
            null,
            TestContext.Current.CancellationToken
        );
        return response.StatusCode;
    }

    private static async Task<HttpStatusCode> Decide(HttpClient office, Guid applicationId)
    {
        using var response = await office.PutAsJsonAsync(
            $"/v2/applications/{applicationId}/decision",
            new ApplicationDecisionRequest(true),
            TestContext.Current.CancellationToken
        );
        return response.StatusCode;
    }

    private static async Task<List<CruiseApplicationCandidateResponse>> PlanningCandidates(
        HttpClient office,
        Guid? cruiseId
    ) =>
        (
            await office.GetFromJsonAsync<List<CruiseApplicationCandidateResponse>>(
                "/v2/applications/for-cruise-planning"
                    + (cruiseId is null ? "" : $"?cruiseId={cruiseId}"),
                TestContext.Current.CancellationToken
            )
        )!;

    private static async Task SubmitFormB(TestApplication app, Seeded application) =>
        Assert.Equal(HttpStatusCode.Created, await SubmitFormBStatus(app, application));

    private static async Task<HttpStatusCode> SubmitFormBStatus(
        TestApplication app,
        Seeded application
    )
    {
        using var manager = await TestApplications.Login(app, application.OwnerEmail);
        using var response = await manager.PutAsJsonAsync(
            $"/v2/applications/{application.Id}/form-b",
            new FormBWriteRequest
            {
                Form = new FormBFields { IsCruiseManagerPresent = "true" },
                Draft = false,
            },
            TestContext.Current.CancellationToken
        );
        return response.StatusCode;
    }

    // One finished doctoral effect with both conditions met: 200 points each for the
    // manager and the deputy slot (the deputy is Guid.Empty unless seeded).
    private static async Task<HttpStatusCode> SubmitFormC(TestApplication app, Seeded application)
    {
        var fields = new FormCFields { ShipUsage = "0", DifferentUsage = "" };
        fields.ResearchTasksEffects.Add(
            new ResearchTaskEffectFields
            {
                Type = "2",
                Title = $"Doctoral {application.OwnerEmail}",
                Done = "true",
                ManagerConditionMet = "true",
                DeputyConditionMet = "true",
            }
        );
        using var manager = await TestApplications.Login(app, application.OwnerEmail);
        using var response = await manager.PutAsJsonAsync(
            $"/v2/applications/{application.Id}/form-c",
            new FormCWriteRequest { Form = fields, Draft = false },
            TestContext.Current.CancellationToken
        );
        return response.StatusCode;
    }

    private static async Task AssertCruise(TestApplication app, Guid cruiseId, CruiseStatus status)
    {
        var ct = TestContext.Current.CancellationToken;
        await app.InDatabase(async db =>
            Assert.Equal(
                status,
                (await db.Cruises.SingleAsync(row => row.Id == cruiseId, ct)).Status
            )
        );
    }

    private static async Task AssertApplication(
        TestApplication app,
        Guid applicationId,
        CruiseApplicationStatus status,
        Guid? cruiseId,
        bool formB = false,
        bool formC = false,
        int points = 0
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await app.InDatabase(async db =>
        {
            var row = await db
                .CruiseApplications.AsNoTracking()
                .Where(row => row.Id == applicationId)
                .Select(row => new
                {
                    row.Status,
                    CruiseId = row.Cruise == null ? (Guid?)null : row.Cruise.Id,
                    HasFormB = row.FormB != null,
                    HasFormC = row.FormC != null,
                })
                .SingleAsync(ct);
            var awarded = await db
                .UserEffects.Where(effect =>
                    effect.Effect.FormC.CruiseApplication.Id == applicationId
                )
                .SumAsync(effect => effect.Points, ct);
            Assert.Equal(
                (status, cruiseId, formB, formC, points),
                (row.Status, row.CruiseId, row.HasFormB, row.HasFormC, awarded)
            );
        });
    }

    private static async Task<int> PendingEmails(TestApplication app)
    {
        var count = 0;
        await app.InDatabase(async db =>
            count = await db.EmailOutboxMessages.CountAsync(TestContext.Current.CancellationToken)
        );
        return count;
    }

    private static async Task<Dictionary<string, int>> DispatchConfirmations(TestApplication app)
    {
        await app.Dispatch(TestContext.Current.CancellationToken);
        var counts = app
            .Transport.Messages.Where(message => message.Payload.Subject == ConfirmationSubject)
            .GroupBy(message => message.Payload.Recipient)
            .OrderBy(group => group.Key, StringComparer.Ordinal)
            .ToDictionary(group => group.Key, group => group.Count());
        app.Transport.Messages.Clear();
        return counts;
    }
}
