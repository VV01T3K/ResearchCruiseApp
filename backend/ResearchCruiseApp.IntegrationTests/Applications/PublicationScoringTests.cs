using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Api.Users;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Applications;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class PublicationScoringTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    [Fact]
    public async Task FormACreate_WhenSubmittedTwiceAtOnce_KeepsOnePublication()
    {
        var ct = TestContext.Current.CancellationToken;
        var gate = new SaveChangesGate();
        await using var app = new TestApplication(fixture.ConnectionString, interceptor: gate);
        var owner = await TestUsers.Create(app, "owner@example.invalid", RoleName.CruiseManager);
        using var client = await TestApplications.Login(app, owner.Email!);
        var form = FormAccessTests.Draft(Guid.Parse(owner.Id));
        form.Publications.Add(
            new PublicationFields
            {
                Category = "subject",
                Title = "Race",
                MinisterialPoints = "",
            }
        );
        Task<HttpResponseMessage> Submit() =>
            client.PostAsJsonAsync(
                "/v2/applications",
                new FormAWriteRequest { Form = form, Draft = true },
                ct
            );

        gate.Hold(InsertsPublication);
        var (first, second) = await gate.Race(fixture.ConnectionString, Submit(), Submit, ct);

        using (first)
            Assert.Equal(HttpStatusCode.Created, first.StatusCode);
        using (second)
            Assert.Contains(
                second.StatusCode,
                new[] { HttpStatusCode.Created, HttpStatusCode.Conflict }
            );
        await app.InDatabase(async db => Assert.Equal(1, await db.Publications.CountAsync(ct)));
    }

    [Fact]
    public async Task Import_WhenSentTwiceAtOnce_KeepsOneCopyOfEachPublication()
    {
        var ct = TestContext.Current.CancellationToken;
        var gate = new SaveChangesGate();
        await using var app = new TestApplication(fixture.ConnectionString, interceptor: gate);
        var owner = await TestUsers.Create(app, "owner@example.invalid", RoleName.CruiseManager);
        using var client = await TestApplications.Login(app, owner.Email!);
        Task<HttpResponseMessage> Import() =>
            client.PostAsJsonAsync(
                ImportRoute,
                new[] { ImportedPublication("First"), ImportedPublication("Second") },
                ct
            );

        gate.Hold(InsertsPublication);
        var (first, second) = await gate.Race(fixture.ConnectionString, Import(), Import, ct);

        using (first)
            Assert.Equal(HttpStatusCode.OK, first.StatusCode);
        using (second)
            Assert.Contains(
                second.StatusCode,
                new[] { HttpStatusCode.OK, HttpStatusCode.Conflict }
            );
        await app.InDatabase(async db =>
        {
            Assert.Equal(2, await db.Publications.CountAsync(ct));
            Assert.Equal(2, await db.UserPublications.CountAsync(ct));
        });
    }

    [Fact]
    public async Task Import_ReportsCountsAndMatchesExistingRowsLikeTheDatabase()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var owner = await TestUsers.Create(app, "owner@example.invalid", RoleName.CruiseManager);
        using var client = await TestApplications.Login(app, owner.Email!);
        using var seeded = await client.PostAsJsonAsync(
            ImportRoute,
            new[] { ImportedPublication("Existing") },
            ct
        );
        seeded.EnsureSuccessStatusCode();

        using var imported = await client.PostAsJsonAsync(
            ImportRoute,
            new[]
            {
                ImportedPublication("Existing"),
                ImportedPublication("EXISTING"),
                ImportedPublication("New"),
                ImportedPublication("New"),
            },
            ct
        );

        Assert.Equal(
            new ImportPublicationsResponse(1, 3),
            await imported.Content.ReadFromJsonAsync<ImportPublicationsResponse>(ct)
        );
        await app.InDatabase(async db =>
        {
            Assert.Equal(2, await db.Publications.CountAsync(ct));
            Assert.Equal(2, await db.UserPublications.CountAsync(ct));
        });
    }

    [Fact]
    public async Task Import_WhenTextDiffersOnlyByUnicodeComposition_CountsRowAsExisting()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var owner = await TestUsers.Create(app, "owner@example.invalid", RoleName.CruiseManager);
        using var client = await TestApplications.Login(app, owner.Email!);
        using var seeded = await client.PostAsJsonAsync(
            ImportRoute,
            new[] { ImportedPublication("Gda\u0144sk") },
            ct
        );
        seeded.EnsureSuccessStatusCode();

        using var imported = await client.PostAsJsonAsync(
            ImportRoute,
            new[] { ImportedPublication("Gdan\u0301sk") },
            ct
        );

        Assert.Equal(
            new ImportPublicationsResponse(0, 1),
            await imported.Content.ReadFromJsonAsync<ImportPublicationsResponse>(ct)
        );
        await app.InDatabase(async db => Assert.Equal(1, await db.Publications.CountAsync(ct)));
    }

    [Fact]
    public async Task Import_WhenPointsAreZero_KeepsRowSelectableInFormAWithZeroScore()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var owner = await TestUsers.Create(app, "owner@example.invalid", RoleName.CruiseManager);
        using var client = await TestApplications.Login(app, owner.Email!);
        using var imported = await client.PostAsJsonAsync(
            ImportRoute,
            new[] { ImportedPublication("Zero") with { MinisterialPoints = "0" } },
            ct
        );
        Assert.Equal(
            new ImportPublicationsResponse(1, 0),
            await imported.Content.ReadFromJsonAsync<ImportPublicationsResponse>(ct)
        );

        var publications = await client.GetFromJsonAsync<List<PublicationResponse>>(
            "/v2/users/me/publications",
            ct
        );
        Assert.Equal("0", Assert.Single(publications!).MinisterialPoints);
        var context = await client.GetFromJsonAsync<JsonElement>(
            "/v2/applications/form-a/context",
            ct
        );
        var historical = Assert
            .Single(context.GetProperty("historicalPublications").EnumerateArray())
            .Deserialize<PublicationFields>(JsonSerializerOptions.Web)!;
        Assert.Equal("0", historical.MinisterialPoints);

        var form = FormAccessTests.Draft(Guid.Parse(owner.Id));
        form.Publications.Add(historical);
        using var created = await client.PostAsJsonAsync(
            "/v2/applications",
            new FormAWriteRequest { Form = form, Draft = true },
            ct
        );
        Assert.Equal(HttpStatusCode.Created, created.StatusCode);
        Guid id = default;
        await app.InDatabase(async db =>
        {
            id = (await db.CruiseApplications.SingleAsync(ct)).Id;
            Assert.Equal(1, await db.Publications.CountAsync(ct));
            Assert.Equal("0", (await db.Publications.SingleAsync(ct)).MinisterialPoints);
            Assert.Equal(0, (await db.FormAPublications.SingleAsync(ct)).Points);
        });
        var summary = await client.GetFromJsonAsync<JsonElement>($"/v2/applications/{id}", ct);
        Assert.Equal(0, summary.GetProperty("points").GetInt32());
    }

    [Fact]
    public async Task PublicationDelete_WhenSentTwiceAtOnce_DeletesOnceWithoutFailing()
    {
        var ct = TestContext.Current.CancellationToken;
        var gate = new SaveChangesGate();
        await using var app = new TestApplication(fixture.ConnectionString, interceptor: gate);
        var owner = await TestUsers.Create(app, "owner@example.invalid", RoleName.CruiseManager);
        using var client = await TestApplications.Login(app, owner.Email!);
        using var imported = await client.PostAsJsonAsync(
            ImportRoute,
            new[] { ImportedPublication("Only") },
            ct
        );
        Assert.Equal(HttpStatusCode.OK, imported.StatusCode);
        Guid id = default;
        await app.InDatabase(async db => id = (await db.Publications.SingleAsync(ct)).Id);
        Task<HttpResponseMessage> Delete() =>
            client.DeleteAsync($"/v2/users/me/publications/{id}", ct);

        gate.Hold(db =>
            db.ChangeTracker.Entries<UserPublication>()
                .Any(entry => entry.State == EntityState.Deleted)
        );
        var (first, second) = await gate.Race(fixture.ConnectionString, Delete(), Delete, ct);

        using (first)
            Assert.Equal(HttpStatusCode.NoContent, first.StatusCode);
        using (second)
            Assert.Contains(
                second.StatusCode,
                new[] { HttpStatusCode.NotFound, HttpStatusCode.Conflict }
            );
        await app.InDatabase(async db => Assert.Equal(0, await db.Publications.CountAsync(ct)));
    }

    private const string ImportRoute = "/v2/users/me/publications/import";

    private static ImportPublicationRequest ImportedPublication(string title) =>
        new("subject", $"10.1000/{title}", "Author", title, "Journal", "2030", "100");

    private static bool InsertsPublication(DbContext db) =>
        db.ChangeTracker.Entries<Publication>().Any(entry => entry.State == EntityState.Added);

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

    [Theory]
    [InlineData("subject", "500", 500)]
    [InlineData("postscript", "1000", 1000)]
    public async Task Publication_WhenPointsAreAtCap_PreservesScore(
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
            new PublicationFields { Category = category, MinisterialPoints = "1000" }
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

    [Fact]
    public async Task Summary_WhenStoredScoresExceedInt32_ReturnsExactTotal()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var owner = await TestUsers.Create(app, "owner@example.invalid", RoleName.CruiseManager);
        using var client = await TestApplications.Login(app, owner.Email!);
        var form = FormAccessTests.Draft(Guid.Parse(owner.Id));
        foreach (var title in new[] { "first", "second", "third" })
            form.Publications.Add(
                new PublicationFields
                {
                    Category = "subject",
                    Title = title,
                    MinisterialPoints = "",
                }
            );
        using var response = await client.PostAsJsonAsync(
            "/v2/applications",
            new FormAWriteRequest { Form = form, Draft = true },
            ct
        );
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        await app.InDatabase(async db =>
            await db.FormAPublications.ExecuteUpdateAsync(
                row => row.SetProperty(publication => publication.Points, int.MaxValue),
                ct
            )
        );

        var page = await client.GetFromJsonAsync<JsonElement>("/v2/applications", ct);

        var summary = Assert.Single(page.GetProperty("items").EnumerateArray());
        Assert.Equal(3L * int.MaxValue, summary.GetProperty("points").GetInt64());
    }
}
