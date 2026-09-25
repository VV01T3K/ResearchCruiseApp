using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Applications;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class ApplicationScoringTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    // BE-SCORING-001: complete funding bands score points; replacing a draft recalculates them.
    [Theory]
    [InlineData("4", "50", "100", 200)]
    [InlineData("5", "80", "160", 320)]
    public async Task Funding_WhenAmountsCrossBands_PersistsScoresAndRecalculatesReplacement(
        string type,
        string firstBand,
        string secondBand,
        int total
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var owner = await TestUsers.Create(app, "scoring@example.invalid", RoleName.CruiseManager);
        using var client = await TestApplications.Login(app, owner.Email!);
        var form = FormAccessTests.Draft(Guid.Parse(owner.Id));
        string[] amounts = ["0", "99999", "100000", "199999", "200000"];
        foreach (var amount in amounts)
            form.ResearchTasks.Add(
                new ResearchTaskFields
                {
                    Type = type,
                    Title = amount,
                    FinancingAmount = amount,
                }
            );
        using var created = await client.PostAsJsonAsync(
            "/v2/applications",
            new FormAWriteRequest { Form = form, Draft = true },
            ct
        );
        Assert.Equal(HttpStatusCode.Created, created.StatusCode);
        Guid id = default;
        await app.InDatabase(async db => id = (await db.CruiseApplications.SingleAsync(ct)).Id);
        var evaluation = await client.GetFromJsonAsync<CruiseApplicationEvaluation>(
            $"/v2/applications/{id}/evaluation",
            ct
        );
        Assert.NotNull(evaluation);
        var scores = evaluation.FormAResearchTasks.ToDictionary(
            task => task.ResearchTask.Title!,
            task => task.Points
        );
        Assert.Equal(5, scores.Count);
        Assert.Equal("0", scores["0"]);
        Assert.Equal("0", scores["99999"]);
        Assert.Equal(firstBand, scores["100000"]);
        Assert.Equal(firstBand, scores["199999"]);
        Assert.Equal(secondBand, scores["200000"]);
        var summary = await client.GetFromJsonAsync<JsonElement>($"/v2/applications/{id}", ct);
        Assert.Equal(total, summary.GetProperty("points").GetInt32());
        form.ResearchTasks.Clear();
        form.ResearchTasks.Add(new ResearchTaskFields { Type = type, FinancingAmount = "99999" });
        using var replaced = await client.PutAsJsonAsync(
            $"/v2/applications/{id}/form-a",
            new FormAWriteRequest { Form = form, Draft = true },
            ct
        );
        Assert.Equal(HttpStatusCode.NoContent, replaced.StatusCode);
        evaluation = await client.GetFromJsonAsync<CruiseApplicationEvaluation>(
            $"/v2/applications/{id}/evaluation",
            ct
        );
        Assert.Equal("0", Assert.Single(evaluation!.FormAResearchTasks).Points);
        summary = await client.GetFromJsonAsync<JsonElement>($"/v2/applications/{id}", ct);
        Assert.Equal(0, summary.GetProperty("points").GetInt32());
        await app.InDatabase(async db =>
        {
            var stored = await db
                .CruiseApplications.Include(row => row.FormA)
                    .ThenInclude(formA => formA!.FormAResearchTasks)
                .SingleAsync(ct);
            Assert.Equal(CruiseApplicationStatus.Draft, stored.Status);
            Assert.Equal(0, Assert.Single(stored.FormA!.FormAResearchTasks).Points);
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        Assert.Empty(app.Transport.Messages);
    }

    // BE-SCORING-002: non-finite amounts cannot enter scoring or persistence.
    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public async Task Funding_WhenAmountIsInvalid_RejectsWithoutWritingDraft(bool secured)
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var owner = await TestUsers.Create(
            app,
            "invalid-scoring@example.invalid",
            RoleName.CruiseManager
        );
        using var client = await TestApplications.Login(app, owner.Email!);
        foreach (var amount in new[] { "not-a-number", "-1", "NaN", "Infinity", "1e309" })
        {
            var form = FormAccessTests.Draft(Guid.Parse(owner.Id));
            form.ResearchTasks.Add(
                new ResearchTaskFields
                {
                    Type = "4",
                    FinancingAmount = secured ? "100000" : amount,
                    SecuredAmount = secured ? amount : null,
                }
            );
            using var response = await client.PostAsJsonAsync(
                "/v2/applications",
                new FormAWriteRequest { Form = form, Draft = true },
                ct
            );
            Assert.True(
                response.StatusCode == HttpStatusCode.BadRequest,
                $"Amount {amount} returned {(int)response.StatusCode}"
            );
            await app.InDatabase(async db =>
            {
                Assert.Empty(await db.CruiseApplications.ToListAsync(ct));
                Assert.Empty(await db.FormsA.ToListAsync(ct));
                Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
            });
        }
        Assert.Empty(app.Transport.Messages);
    }

    // BE-SCORING-003: incomplete drafts may omit funding without failing numeric scoring.
    [Theory]
    [InlineData(null)]
    [InlineData("")]
    public async Task Funding_WhenDraftAmountIsAbsent_SavesBothProjectTypesWithZeroPoints(
        string? amount
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var owner = await TestUsers.Create(
            app,
            "incomplete-scoring@example.invalid",
            RoleName.CruiseManager
        );
        using var client = await TestApplications.Login(app, owner.Email!);
        var form = FormAccessTests.Draft(Guid.Parse(owner.Id));
        foreach (var type in new[] { "4", "5" })
            form.ResearchTasks.Add(
                new ResearchTaskFields { Type = type, FinancingAmount = amount }
            );
        using var response = await client.PostAsJsonAsync(
            "/v2/applications",
            new FormAWriteRequest { Form = form, Draft = true },
            ct
        );
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        Guid id = default;
        await app.InDatabase(async db =>
        {
            var stored = await db
                .CruiseApplications.Include(row => row.FormA)
                    .ThenInclude(formA => formA!.FormAResearchTasks)
                .SingleAsync(ct);
            id = stored.Id;
            Assert.Equal(CruiseApplicationStatus.Draft, stored.Status);
            Assert.Equal(2, stored.FormA!.FormAResearchTasks.Count);
            Assert.All(stored.FormA.FormAResearchTasks, task => Assert.Equal(0, task.Points));
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        var summary = await client.GetFromJsonAsync<JsonElement>($"/v2/applications/{id}", ct);
        Assert.Equal(0, summary.GetProperty("points").GetInt32());
        Assert.Empty(app.Transport.Messages);
    }
}
