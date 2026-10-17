using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Api.Cruises;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Cruises;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed partial class CruiseStatusTransitionTests(SqlFixture fixture) : IAsyncLifetime
{
    private const string ConfirmationSubject = "Rejs zaakceptowany";
    private const string EndedCruiseLocked =
        "Nie można edytować zakończonego rejsu. Aby wprowadzić zmiany, najpierw cofnij status rejsu.";
    private const string ReportedBlocksRevert =
        "Nie można cofnąć statusu rejsu, ponieważ co najmniej jedno zgłoszenie ma już złożony Formularz C.";

    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    // #467
    [Fact]
    public async Task RemoveFromConfirmedCruise_ReturnsApplicationsToAcceptedAndKeepsFormB()
    {
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
        await DispatchConfirmations(app);

        Assert.Equal(HttpStatusCode.NoContent, await Patch(office, cruiseId, []));

        await AssertCruise(app, cruiseId, CruiseStatus.Confirmed);
        await AssertApplication(app, required.Id, CruiseApplicationStatus.Accepted, null);
        await AssertApplication(
            app,
            filled.Id,
            CruiseApplicationStatus.Accepted,
            null,
            formB: true
        );
        Assert.Equal(0, await PendingEmails(app));
        Assert.Equal(
            new[] { filled.Id, required.Id }.Order(),
            (await PlanningCandidates(office)).Select(candidate => candidate.Id).Order()
        );

        // Planned on another cruise and confirmed, both must submit Form B for it.
        var otherId = await PostCruise(app, office, "Other");
        Assert.Equal(
            HttpStatusCode.NoContent,
            await Patch(office, otherId, [required.Id, filled.Id])
        );
        await AssertApplication(app, required.Id, CruiseApplicationStatus.Accepted, otherId);
        await AssertApplication(
            app,
            filled.Id,
            CruiseApplicationStatus.Accepted,
            otherId,
            formB: true
        );
        Assert.Equal(HttpStatusCode.NoContent, await Confirm(office, otherId));
        await AssertApplication(app, required.Id, CruiseApplicationStatus.FormBRequired, otherId);
        await AssertApplication(
            app,
            filled.Id,
            CruiseApplicationStatus.FormBRequired,
            otherId,
            formB: true
        );
        Assert.Equal(
            new Dictionary<string, int> { [filled.OwnerEmail] = 1, [required.OwnerEmail] = 1 },
            await DispatchConfirmations(app)
        );
    }

    // #468, and #467 for ended cruises: membership cannot change once the cruise ended.
    [Theory]
    [InlineData("dates")]
    [InlineData("remove")]
    public async Task UpdateEndedCruise_IsRejectedWithoutChanges(string change)
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var office = await Office(app);
        var original = await Accepted(app, "original@example.invalid");
        var cruiseId = await PostCruise(app, office, "Ended", original.Id);
        Assert.Equal(HttpStatusCode.NoContent, await Confirm(office, cruiseId));
        await SubmitFormB(app, original);
        Assert.Equal(HttpStatusCode.NoContent, await Complete(office, cruiseId));
        var pendingBefore = await PendingEmails(app);
        var request = change switch
        {
            "dates" => new UpdateRequest(
                "2030-09-01",
                "2030-09-05",
                Guid.Empty,
                Guid.Empty,
                [original.Id],
                "Ended",
                false
            ),
            "remove" => new UpdateRequest(
                "2030-06-01",
                "2030-06-02",
                Guid.Empty,
                Guid.Empty,
                [],
                "Ended",
                false
            ),
            _ => throw new ArgumentOutOfRangeException(nameof(change)),
        };

        using var response = await office.PatchAsJsonAsync($"/v2/cruises/{cruiseId}", request, ct);

        await AssertRejected(response, EndedCruiseLocked);
        await app.InDatabase(async db =>
        {
            var cruise = await db.Cruises.SingleAsync(row => row.Id == cruiseId, ct);
            Assert.Equal(
                (CruiseStatus.Ended, "2030-06-01", "2030-06-02", "Ended", Guid.Empty, Guid.Empty),
                (
                    cruise.Status,
                    cruise.StartDate,
                    cruise.EndDate,
                    cruise.Title,
                    cruise.MainCruiseManagerId,
                    cruise.MainDeputyManagerId
                )
            );
        });
        await AssertApplication(
            app,
            original.Id,
            CruiseApplicationStatus.Undertaken,
            cruiseId,
            formB: true
        );
        Assert.Equal(pendingBefore, await PendingEmails(app));
    }

    // The UG Form C allows the effects to be edited after the cruise ends.
    [Fact]
    public async Task EndedCruise_StillAcceptsFormCAndAllowsReopeningIt()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var office = await Office(app);
        var application = await Accepted(app, "manager@example.invalid");
        var cruiseId = await PostCruise(app, office, "Ended", application.Id);
        Assert.Equal(HttpStatusCode.NoContent, await Confirm(office, cruiseId));
        await SubmitFormB(app, application);
        Assert.Equal(HttpStatusCode.NoContent, await Complete(office, cruiseId));

        Assert.Equal(HttpStatusCode.Created, await SubmitFormC(app, application));
        await AssertApplication(
            app,
            application.Id,
            CruiseApplicationStatus.Reported,
            cruiseId,
            formB: true,
            formC: true,
            points: 200
        );

        using var refill = await office.PutAsync(
            $"/v2/applications/{application.Id}/form-c/refill",
            null,
            ct
        );
        Assert.Equal(HttpStatusCode.NoContent, refill.StatusCode);
        await AssertApplication(
            app,
            application.Id,
            CruiseApplicationStatus.Undertaken,
            cruiseId,
            formB: true,
            formC: true,
            points: 200
        );

        Assert.Equal(HttpStatusCode.Created, await SubmitFormC(app, application));
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
    }

    // #469
    [Fact]
    public async Task ConfirmUndoConfirm_KeepsFilledFormBAndEmailsOnlyApplicationsAskedForIt()
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
                [deputy.Email!] = 1,
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
        Assert.Equal(0, await PendingEmails(app));

        Assert.Equal(HttpStatusCode.NoContent, await Confirm(office, cruiseId));

        await AssertCruise(app, cruiseId, CruiseStatus.Confirmed);
        await AssertApplication(app, required.Id, CruiseApplicationStatus.FormBRequired, cruiseId);
        await AssertApplication(
            app,
            filled.Id,
            CruiseApplicationStatus.FormBFilled,
            cruiseId,
            formB: true
        );
        Assert.Equal(
            new Dictionary<string, int> { [deputy.Email!] = 1, [required.OwnerEmail] = 1 },
            await DispatchConfirmations(app)
        );
    }

    [Fact]
    public async Task AddToConfirmedCruise_RequestsFormBAndEmailsOnlyTheAddedApplicationsPeopleOnce()
    {
        await using var app = new TestApplication(fixture.ConnectionString);
        var office = await Office(app);
        var deputy = await TestUsers.Create(app, "deputy@example.invalid", RoleName.CruiseManager);
        var deputyId = Guid.Parse(deputy.Id);
        var existing = await Accepted(app, "existing@example.invalid");
        var first = await Accepted(app, "first@example.invalid", deputyId);
        var second = await Accepted(app, "second@example.invalid", deputyId);
        var cruiseId = await PostCruise(app, office, "Confirmed", existing.Id);
        Assert.Equal(HttpStatusCode.NoContent, await Confirm(office, cruiseId));
        await DispatchConfirmations(app);

        Assert.Equal(
            HttpStatusCode.NoContent,
            await Patch(office, cruiseId, [existing.Id, first.Id, second.Id])
        );

        await AssertApplication(app, existing.Id, CruiseApplicationStatus.FormBRequired, cruiseId);
        await AssertApplication(app, first.Id, CruiseApplicationStatus.FormBRequired, cruiseId);
        await AssertApplication(app, second.Id, CruiseApplicationStatus.FormBRequired, cruiseId);
        Assert.Equal(
            new Dictionary<string, int>
            {
                [deputy.Email!] = 1,
                [first.OwnerEmail] = 1,
                [second.OwnerEmail] = 1,
            },
            await DispatchConfirmations(app)
        );

        // Saving again without new applications sends nothing.
        Assert.Equal(
            HttpStatusCode.NoContent,
            await Patch(office, cruiseId, [existing.Id, first.Id, second.Id])
        );
        Assert.Equal(0, await PendingEmails(app));
    }

    // #469
    [Fact]
    public async Task UndoCompletion_WithReportedApplication_IsRejectedWithoutChanges()
    {
        await using var app = new TestApplication(fixture.ConnectionString);
        var office = await Office(app);
        var undertaken = await Accepted(app, "undertaken@example.invalid");
        var reported = await Accepted(app, "reported@example.invalid");
        var cruiseId = await PostCruise(app, office, "Reported", undertaken.Id, reported.Id);
        Assert.Equal(HttpStatusCode.NoContent, await Confirm(office, cruiseId));
        await SubmitFormB(app, undertaken);
        await SubmitFormB(app, reported);
        Assert.Equal(HttpStatusCode.NoContent, await Complete(office, cruiseId));
        Assert.Equal(HttpStatusCode.Created, await SubmitFormC(app, reported));
        var pendingBefore = await PendingEmails(app);

        await AssertRejected(await RevertResponse(office, cruiseId), ReportedBlocksRevert);

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
            points: 200
        );
        Assert.Equal(pendingBefore, await PendingEmails(app));

        // Accepted bypass: reopening Form C lifts the block; Form C and its points stay.
        using var refill = await office.PutAsync(
            $"/v2/applications/{reported.Id}/form-c/refill",
            null,
            TestContext.Current.CancellationToken
        );
        Assert.Equal(HttpStatusCode.NoContent, refill.StatusCode);
        Assert.Equal(HttpStatusCode.NoContent, await Revert(office, cruiseId));
        await AssertCruise(app, cruiseId, CruiseStatus.Confirmed);
        await AssertApplication(
            app,
            reported.Id,
            CruiseApplicationStatus.FormBFilled,
            cruiseId,
            formB: true,
            formC: true,
            points: 200
        );
    }

    private sealed record Seeded(Guid Id, string OwnerEmail);

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
        if (deputyId is not null)
            await app.InDatabase(async db =>
            {
                (
                    await db
                        .CruiseApplications.Include(row => row.FormA)
                        .SingleAsync(row => row.Id == id, ct)
                )
                    .FormA!
                    .DeputyManagerId = deputyId.Value;
                await db.SaveChangesAsync(ct);
            });
        return new Seeded(id, email);
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
        using var response = await PatchResponse(office, cruiseId, applicationIds);
        return response.StatusCode;
    }

    private static Task<HttpResponseMessage> PatchResponse(
        HttpClient office,
        Guid cruiseId,
        List<Guid> applicationIds
    ) =>
        office.PatchAsJsonAsync(
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
        using var response = await RevertResponse(office, cruiseId);
        return response.StatusCode;
    }

    private static Task<HttpResponseMessage> RevertResponse(HttpClient office, Guid cruiseId) =>
        office.DeleteAsync(
            $"/v2/cruises/{cruiseId}/confirmation",
            TestContext.Current.CancellationToken
        );

    private static async Task AssertRejected(HttpResponseMessage response, string detail)
    {
        using (response)
        {
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var problem = await response.Content.ReadFromJsonAsync<JsonElement>(
                TestContext.Current.CancellationToken
            );
            Assert.Equal(detail, problem.GetProperty("detail").GetString());
        }
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

    private static async Task<List<CruiseApplicationCandidateResponse>> PlanningCandidates(
        HttpClient office
    ) =>
        (
            await office.GetFromJsonAsync<List<CruiseApplicationCandidateResponse>>(
                "/v2/applications/for-cruise-planning",
                TestContext.Current.CancellationToken
            )
        )!;

    private static async Task SubmitFormB(TestApplication app, Seeded application)
    {
        using var manager = await TestApplications.Login(app, application.OwnerEmail);
        using var response = await SendFormB(manager, application);
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    private static Task<HttpResponseMessage> SendFormB(HttpClient manager, Seeded application) =>
        manager.PutAsJsonAsync(
            $"/v2/applications/{application.Id}/form-b",
            new FormBWriteRequest
            {
                Form = new FormBFields { IsCruiseManagerPresent = "true" },
                Draft = false,
            },
            TestContext.Current.CancellationToken
        );

    // 200 points for the manager; seeded applications have no deputy.
    private static async Task<HttpStatusCode> SubmitFormC(TestApplication app, Seeded application)
    {
        using var manager = await TestApplications.Login(app, application.OwnerEmail);
        using var response = await SendFormC(manager, application);
        return response.StatusCode;
    }

    private static Task<HttpResponseMessage> SendFormC(HttpClient manager, Seeded application)
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
        return manager.PutAsJsonAsync(
            $"/v2/applications/{application.Id}/form-c",
            new FormCWriteRequest { Form = fields, Draft = false },
            TestContext.Current.CancellationToken
        );
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
