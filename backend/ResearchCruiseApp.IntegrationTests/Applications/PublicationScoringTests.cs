using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Applications;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class PublicationScoringTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    // BE-SCORING-009: reject numbers that cannot be safely parsed into stored signed points.
    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public async Task Publication_WhenPointsAreInvalid_RejectsWithoutWriting(bool draft)
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var owner = await TestUsers.Create(app, "owner@example.invalid", RoleName.CruiseManager);
        var deputy = await TestUsers.Create(app, "deputy@example.invalid", RoleName.CruiseManager);
        var unit = new UgUnit { Name = "Publication faculty", IsActive = true };
        await app.InDatabase(async db =>
        {
            db.UgUnits.Add(unit);
            await db.SaveChangesAsync(ct);
        });
        using var client = await TestApplications.Login(app, owner.Email!);
        var form = FormAWorkflowTests.CompleteForm(
            Guid.Parse(owner.Id),
            Guid.Parse(deputy.Id),
            unit.Id
        );
        foreach (
            var amount in new[]
            {
                (string?)null,
                "not-a-number",
                "-1",
                "NaN",
                "Infinity",
                "2147483648",
                "4294967295",
            }
        )
        {
            form.Publications.Clear();
            form.Publications.Add(
                new PublicationFields
                {
                    Category = "postscript",
                    MinisterialPoints = amount!,
                    Doi = "synthetic-doi",
                    Authors = "Synthetic author",
                    Title = "Synthetic title",
                    Magazine = "Synthetic journal",
                    Year = "2030",
                }
            );
            using var response = await client.PostAsJsonAsync(
                "/v2/applications",
                new FormAWriteRequest { Form = form, Draft = draft },
                ct
            );
            Assert.True(
                response.StatusCode == HttpStatusCode.BadRequest,
                $"Draft={draft}, points={amount}: {(int)response.StatusCode}"
            );
            using var problem = await JsonDocument.ParseAsync(
                await response.Content.ReadAsStreamAsync(ct),
                cancellationToken: ct
            );
            Assert.NotEmpty(
                problem
                    .RootElement.GetProperty("errors")
                    .GetProperty(
                        amount is null
                            ? "Form.Publications[0].MinisterialPoints"
                            : "Form.Publications[0]"
                    )
                    .EnumerateArray()
            );
            await app.InDatabase(async db =>
            {
                Assert.Empty(await db.CruiseApplications.ToListAsync(ct));
                Assert.Empty(await db.FormsA.ToListAsync(ct));
                Assert.Empty(await db.FormAPublications.ToListAsync(ct));
                Assert.Empty(await db.Publications.ToListAsync(ct));
                Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
            });
        }
        Assert.Empty(app.Transport.Messages);
    }

    // BE-SCORING-010: incomplete drafts carry zero publication points until filled in.
    [Fact]
    public async Task Publication_WhenDraftPointsAreEmpty_PersistsBothCategoriesWithZeroPoints()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var owner = await TestUsers.Create(app, "owner@example.invalid", RoleName.CruiseManager);
        using var client = await TestApplications.Login(app, owner.Email!);
        var form = FormAccessTests.Draft(Guid.Parse(owner.Id));
        foreach (var category in new[] { "subject", "postscript" })
            form.Publications.Add(
                new PublicationFields
                {
                    Category = category,
                    Title = category,
                    MinisterialPoints = "",
                }
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
            var application = await db.CruiseApplications.SingleAsync(ct);
            id = application.Id;
            Assert.Equal(CruiseApplicationStatus.Draft, application.Status);
            var scores = await db.FormAPublications.ToListAsync(ct);
            Assert.Equal(2, scores.Count);
            Assert.All(scores, publication => Assert.Equal(0, publication.Points));
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        var evaluation = await client.GetFromJsonAsync<CruiseApplicationEvaluation>(
            $"/v2/applications/{id}/evaluation",
            ct
        );
        Assert.Equal(2, evaluation!.FormAPublications.Count);
        Assert.All(
            evaluation.FormAPublications,
            publication => Assert.Equal("0", publication.Points)
        );
        var summary = await client.GetFromJsonAsync<JsonElement>($"/v2/applications/{id}", ct);
        Assert.Equal(0, summary.GetProperty("points").GetInt32());
        Assert.Empty(app.Transport.Messages);
    }

    // BE-SCORING-011: valid individual Int32 maximum and fractional subject truncation.
    [Theory]
    [InlineData("subject", "1073741823", 1_073_741_823)]
    [InlineData("postscript", "2147483647", 2_147_483_647)]
    public async Task Publication_WhenPointsAreAtSignedMaximum_PreservesRepresentableScore(
        string category,
        string expected,
        int total
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var owner = await TestUsers.Create(app, "owner@example.invalid", RoleName.CruiseManager);
        using var client = await TestApplications.Login(app, owner.Email!);
        var form = FormAccessTests.Draft(Guid.Parse(owner.Id));
        form.Publications.Add(
            new PublicationFields { Category = category, MinisterialPoints = "2147483647" }
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
            var application = await db.CruiseApplications.SingleAsync(ct);
            id = application.Id;
            Assert.Equal(CruiseApplicationStatus.Draft, application.Status);
            Assert.Equal(total, (await db.FormAPublications.SingleAsync(ct)).Points);
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        var evaluation = await client.GetFromJsonAsync<CruiseApplicationEvaluation>(
            $"/v2/applications/{id}/evaluation",
            ct
        );
        Assert.Equal(expected, Assert.Single(evaluation!.FormAPublications).Points);
        var summary = await client.GetFromJsonAsync<JsonElement>($"/v2/applications/{id}", ct);
        Assert.Equal(total, summary.GetProperty("points").GetInt32());
        Assert.Empty(app.Transport.Messages);
    }
}
