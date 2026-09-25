using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Applications;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class SupervisorReviewTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    // BE-SUPERVISOR-002: the first decision changes only the application named by its code.
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

    // BE-SUPERVISOR-003: missing decision data must never become an implicit rejection.
    [Theory]
    [InlineData("{\"code\":\"{code}\"}")]
    [InlineData("{\"accept\":true}")]
    [InlineData("{\"accept\":null,\"code\":\"{code}\"}")]
    [InlineData("{\"accept\":\"true\",\"code\":\"{code}\"}")]
    public async Task Decision_WhenRequiredDataIsInvalid_ReturnsBadRequestWithoutChangingState(
        string body
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var (target, _) = await Seed(app);
        using var client = app.CreateApiClient();
        using var content = new StringContent(
            body.Replace(
                "{code}",
                WebEncoders.Base64UrlEncode(target.SupervisorCode),
                StringComparison.Ordinal
            ),
            System.Text.Encoding.UTF8,
            "application/json"
        );
        using var response = await client.PutAsync(
            $"/v2/applications/{target.Id}/supervisor-review/decision",
            content,
            ct
        );
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        await app.InDatabase(async db =>
        {
            var rows = await db.CruiseApplications.ToListAsync(ct);
            Assert.Equal(2, rows.Count);
            Assert.All(
                rows,
                row => Assert.Equal(CruiseApplicationStatus.WaitingForSupervisor, row.Status)
            );
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        Assert.Empty(app.Transport.Messages);
    }

    // BE-SUPERVISOR-004: review codes authorize exactly one application.
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
