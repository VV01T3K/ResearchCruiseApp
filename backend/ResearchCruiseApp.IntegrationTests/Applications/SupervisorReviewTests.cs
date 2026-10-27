using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.IntegrationTests.Auth;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Applications;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class SupervisorReviewTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    [Theory]
    [InlineData(true, CruiseApplicationStatus.AcceptedBySupervisor)]
    [InlineData(false, CruiseApplicationStatus.DeniedBySupervisor)]
    public async Task FirstDecision_WhenCodeMatches_ChangesOnlyTargetApplication(
        bool accept,
        CruiseApplicationStatus expected
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var (target, other) = await Seed(app);
        using var client = app.CreateApiClient();
        var code = WebEncoders.Base64UrlEncode(target.SupervisorCode);
        using var review = await client.GetAsync(
            $"/v2/applications/{target.Id}/supervisor-review?code={code}",
            ct
        );
        Assert.Equal(HttpStatusCode.OK, review.StatusCode);
        var view = await review.Content.ReadFromJsonAsync<SupervisorReviewResponse>(ct);
        Assert.NotNull(view);
        Assert.Equal(target.FormA!.CruiseManagerId, view.Form.CruiseManagerId);
        using var response = await client.PutAsJsonAsync(
            $"/v2/applications/{target.Id}/supervisor-review/decision",
            new SupervisorDecisionRequest(accept, code),
            ct
        );
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        await app.InDatabase(async db =>
        {
            var rows = await db.CruiseApplications.OrderBy(row => row.Number).ToListAsync(ct);
            Assert.Equal(2, rows.Count);
            var changed = Assert.Single(rows, row => row.Id == target.Id);
            Assert.Equal(expected, changed.Status);
            Assert.Equal("Original", changed.Note);
            Assert.Equal(
                CruiseApplicationStatus.WaitingForSupervisor,
                Assert.Single(rows, row => row.Id == other.Id).Status
            );
            Assert.Equal(2, await db.FormsA.CountAsync(ct));
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        Assert.Empty(app.Transport.Messages);
    }

    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public async Task Decision_WhenAlreadyAnswered_RejectsRepeatAndReversalButAllowsReading(
        bool accept
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var (target, _) = await Seed(app);
        using var client = app.CreateApiClient();
        var code = WebEncoders.Base64UrlEncode(target.SupervisorCode);
        var route = $"/v2/applications/{target.Id}/supervisor-review";
        using var first = await client.PutAsJsonAsync(
            route + "/decision",
            new SupervisorDecisionRequest(accept, code),
            ct
        );
        Assert.Equal(HttpStatusCode.NoContent, first.StatusCode);
        var original = await client.GetStringAsync(route + $"?code={code}", ct);
        foreach (var nextDecision in new[] { accept, !accept })
        {
            using var repeated = await client.PutAsJsonAsync(
                route + "/decision",
                new SupervisorDecisionRequest(nextDecision, code),
                ct
            );
            Assert.Equal(HttpStatusCode.Forbidden, repeated.StatusCode);
            Assert.Equal(original, await client.GetStringAsync(route + $"?code={code}", ct));
            await app.InDatabase(async db =>
            {
                var stored = await db.CruiseApplications.SingleAsync(a => a.Id == target.Id, ct);
                Assert.Equal(
                    accept
                        ? CruiseApplicationStatus.AcceptedBySupervisor
                        : CruiseApplicationStatus.DeniedBySupervisor,
                    stored.Status
                );
                Assert.Equal(target.SupervisorCode, stored.SupervisorCode);
                Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
            });
        }
        Assert.Empty(app.Transport.Messages);
    }

    [Fact]
    public async Task Review_WhenCodeIsInvalidOrBelongsToAnotherApplication_DeniesWithoutChanges()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var (target, other) = await Seed(app);
        using var client = app.CreateApiClient();
        var route = $"/v2/applications/{target.Id}/supervisor-review";
        using var missing = await client.GetAsync(route, ct);
        Assert.Equal(HttpStatusCode.BadRequest, missing.StatusCode);
        string[] codes = ["!invalid!", "", WebEncoders.Base64UrlEncode(other.SupervisorCode)];
        foreach (var code in codes)
        {
            using var view = await client.GetAsync(
                route + $"?code={Uri.EscapeDataString(code)}",
                ct
            );
            Assert.Equal(HttpStatusCode.NotFound, view.StatusCode);
            using var decision = await client.PutAsJsonAsync(
                route + "/decision",
                new SupervisorDecisionRequest(true, code),
                ct
            );
            Assert.Equal(HttpStatusCode.NotFound, decision.StatusCode);
            await app.InDatabase(async db =>
            {
                var rows = await db.CruiseApplications.ToListAsync(ct);
                Assert.Equal(2, rows.Count);
                Assert.All(
                    rows,
                    row =>
                    {
                        Assert.Equal(CruiseApplicationStatus.WaitingForSupervisor, row.Status);
                        Assert.Equal("Original", row.Note);
                    }
                );
                Assert.Equal(2, await db.FormsA.CountAsync(ct));
                Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
            });
        }
        Assert.Empty(app.Transport.Messages);
    }

    [Fact]
    public async Task ResendInvitation_AfterExpiredEmail_QueuesFreshLinkOnlyForOfficeWhileWaiting()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var (target, _) = await Seed(app);
        await TestUsers.Create(app, "office@example.invalid", RoleName.Shipowner);
        using var office = await TestApplications.Login(app, "office@example.invalid");
        using var manager = await TestApplications.Login(app, "review-owner@example.invalid");
        using var anonymous = app.CreateApiClient();
        var route = $"/v2/applications/{target.Id}/supervisor-review/invitation";

        Assert.Equal(
            HttpStatusCode.NoContent,
            (await office.PostAsync(route, null, ct)).StatusCode
        );
        app.Clock.Advance(TimeSpan.FromHours(13));
        await app.Dispatch(ct);
        Assert.Empty(app.Transport.Messages);
        Assert.Equal(
            HttpStatusCode.Forbidden,
            (await manager.PostAsync(route, null, ct)).StatusCode
        );
        Assert.Equal(
            HttpStatusCode.Unauthorized,
            (await anonymous.PostAsync(route, null, ct)).StatusCode
        );

        Assert.Equal(
            HttpStatusCode.NoContent,
            (await office.PostAsync(route, null, ct)).StatusCode
        );
        await app.Dispatch(ct);
        var mail = Assert.Single(app.Transport.Messages);
        Assert.Equal("supervisor@example.invalid", mail.Payload.Recipient);
        var code = QueryHelpers
            .ParseQuery(PasswordRecoveryTests.Link(mail.Payload.Body, "cruise-approval").Query)[
                "supervisorCode"
            ]
            .ToString();
        Assert.Equal(WebEncoders.Base64UrlEncode(target.SupervisorCode), code);
        using var decision = await anonymous.PutAsJsonAsync(
            $"/v2/applications/{target.Id}/supervisor-review/decision",
            new SupervisorDecisionRequest(true, code),
            ct
        );
        Assert.Equal(HttpStatusCode.NoContent, decision.StatusCode);

        Assert.Equal(
            HttpStatusCode.Forbidden,
            (await office.PostAsync(route, null, ct)).StatusCode
        );
        await app.Dispatch(ct);
        Assert.Single(app.Transport.Messages);
    }

    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public async Task Decision_AfterOfficeDecided_DoesNotClaimSupervisorAnswered(bool officeAccepts)
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var (target, _) = await Seed(app);
        await TestUsers.Create(app, "office@example.invalid", RoleName.Shipowner);
        using var office = await TestApplications.Login(app, "office@example.invalid");
        using var supervisor = app.CreateApiClient();
        using var officeDecision = await office.PutAsJsonAsync(
            $"/v2/applications/{target.Id}/decision",
            new ApplicationDecisionRequest(officeAccepts),
            ct
        );
        Assert.Equal(HttpStatusCode.NoContent, officeDecision.StatusCode);

        using var late = await supervisor.PutAsJsonAsync(
            $"/v2/applications/{target.Id}/supervisor-review/decision",
            new SupervisorDecisionRequest(true, WebEncoders.Base64UrlEncode(target.SupervisorCode)),
            ct
        );

        Assert.Equal(HttpStatusCode.Forbidden, late.StatusCode);
        var problem = await late.Content.ReadFromJsonAsync<JsonElement>(ct);
        Assert.Contains("Biuro Armatora", problem.GetProperty("detail").GetString());
    }

    [Fact]
    public async Task Decision_WhileOfficeDecides_LetsOnlyOneActOnWaitingApplication()
    {
        var ct = TestContext.Current.CancellationToken;
        var gate = new SaveChangesGate();
        await using var app = new TestApplication(fixture.ConnectionString, interceptor: gate);
        var (target, _) = await Seed(app);
        await TestUsers.Create(app, "office@example.invalid", RoleName.Shipowner);
        using var office = await TestApplications.Login(app, "office@example.invalid");
        using var supervisor = app.CreateApiClient();

        gate.Hold(db =>
            db.ChangeTracker.Entries<CruiseApplication>()
                .Any(entry => entry.Entity.Status == CruiseApplicationStatus.DeniedBySupervisor)
        );
        var (denied, accepted) = await gate.Race(
            fixture.ConnectionString,
            supervisor.PutAsJsonAsync(
                $"/v2/applications/{target.Id}/supervisor-review/decision",
                new SupervisorDecisionRequest(
                    false,
                    WebEncoders.Base64UrlEncode(target.SupervisorCode)
                ),
                ct
            ),
            () =>
                office.PutAsJsonAsync(
                    $"/v2/applications/{target.Id}/decision",
                    new ApplicationDecisionRequest(true),
                    ct
                ),
            ct
        );

        Assert.Equal(HttpStatusCode.NoContent, denied.StatusCode);
        Assert.Equal(HttpStatusCode.Conflict, accepted.StatusCode);
        await app.InDatabase(async db =>
            Assert.Equal(
                CruiseApplicationStatus.DeniedBySupervisor,
                (await db.CruiseApplications.SingleAsync(a => a.Id == target.Id, ct)).Status
            )
        );
    }

    private static async Task<(CruiseApplication Target, CruiseApplication Other)> Seed(
        TestApplication app
    )
    {
        var owner = await TestUsers.Create(
            app,
            "review-owner@example.invalid",
            RoleName.CruiseManager
        );
        var target = Create(Guid.Parse(owner.Id), [1, 2, 3, 4, 5, 6, 7, 8]);
        var other = Create(Guid.Parse(owner.Id), [9, 10, 11, 12, 13, 14, 15, 16]);
        await app.InDatabase(async db =>
        {
            db.CruiseApplications.AddRange(target, other);
            await db.SaveChangesAsync(TestContext.Current.CancellationToken);
        });
        return (target, other);
    }

    private static CruiseApplication Create(Guid ownerId, byte[] code) =>
        new()
        {
            Date = new DateOnly(2030, 1, 15),
            Status = CruiseApplicationStatus.WaitingForSupervisor,
            SupervisorCode = code,
            Note = "Original",
            FormA = new FormA
            {
                CruiseManagerId = ownerId,
                DeputyManagerId = ownerId,
                Year = "2030",
                CruiseHours = "24",
                PeriodNotes = "",
                DifferentUsage = "",
                CruiseGoalDescription = "",
                SupervisorEmail = "supervisor@example.invalid",
            },
        };
}
