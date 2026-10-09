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
public sealed class ApplicationScoringTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    [Fact]
    public async Task ResearchTasks_WhenCategoriesAreCombined_PersistsEachScoreAndClearsReplacement()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var owner = await TestUsers.Create(app, "scoring@example.invalid", RoleName.CruiseManager);
        using var client = await TestApplications.Login(app, owner.Email!);
        var form = FormAccessTests.Draft(Guid.Parse(owner.Id));
        var cases = new[]
        {
            (Title: "Bachelor", Type: "0", Financing: (string?)null, Points: 20),
            (Title: "Master", Type: "1", Financing: (string?)null, Points: 50),
            (Title: "Doctoral", Type: "2", Financing: (string?)null, Points: 100),
            (Title: "Preparation approved", Type: "3", Financing: "true", Points: 150),
            (Title: "Preparation unapproved", Type: "3", Financing: "false", Points: 100),
            (Title: "Preparation incomplete", Type: "3", Financing: (string?)null, Points: 100),
            (Title: "Internal", Type: "6", Financing: (string?)null, Points: 30),
            (Title: "Other project", Type: "7", Financing: (string?)null, Points: 0),
            (Title: "Commercial", Type: "8", Financing: (string?)null, Points: 0),
            (Title: "Didactics", Type: "9", Financing: (string?)null, Points: 0),
            (Title: "Own research", Type: "10", Financing: (string?)null, Points: 100),
            (Title: "Other research", Type: "11", Financing: (string?)null, Points: 0),
        };
        foreach (var item in cases)
            form.ResearchTasks.Add(
                new ResearchTaskFields
                {
                    Type = item.Type,
                    Title = item.Title,
                    FinancingApproved = item.Financing,
                }
            );
        var id = await CreateDraft(app, client, form);
        var evaluation = await client.GetFromJsonAsync<CruiseApplicationEvaluation>(
            $"/v2/applications/{id}/evaluation",
            ct
        );
        Assert.Equal(cases.Length, evaluation!.FormAResearchTasks.Count);
        foreach (var item in cases)
            Assert.Equal(
                item.Points.ToString(System.Globalization.CultureInfo.InvariantCulture),
                Assert
                    .Single(
                        evaluation.FormAResearchTasks,
                        task => task.ResearchTask.Title == item.Title
                    )
                    .Points
            );
        await app.InDatabase(async db =>
        {
            var scores = await db
                .FormAResearchTasks.Include(task => task.ResearchTask)
                .ToListAsync(ct);
            Assert.Equal(cases.Length, scores.Count);
            foreach (var item in cases)
                Assert.Equal(
                    item.Points,
                    Assert.Single(scores, task => task.ResearchTask.Title == item.Title).Points
                );
        });
        await AssertSummary(app, client, id, 650);
        form.ResearchTasks.Clear();
        await ReplaceDraft(client, id, form);
        Assert.Empty(
            (
                await client.GetFromJsonAsync<CruiseApplicationEvaluation>(
                    $"/v2/applications/{id}/evaluation",
                    ct
                )
            )!.FormAResearchTasks
        );
        await app.InDatabase(async db => Assert.Empty(await db.FormAResearchTasks.ToListAsync(ct)));
        await AssertSummary(app, client, id, 0);
    }

    [Fact]
    public async Task SupportingCategories_WhenCombined_PersistsScoresAndRecalculatesRemoval()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var owner = await TestUsers.Create(app, "scoring@example.invalid", RoleName.CruiseManager);
        using var client = await TestApplications.Login(app, owner.Email!);
        var form = FormAccessTests.Draft(Guid.Parse(owner.Id));
        form.Contracts.AddRange([
            new ContractFields { Category = "domestic", InstitutionName = "Domestic" },
            new ContractFields { Category = "international", InstitutionName = "International" },
        ]);
        foreach (var amount in new[] { "0", "1", "99", "100" })
            form.Publications.Add(
                new PublicationFields
                {
                    Category = "subject",
                    Title = amount,
                    MinisterialPoints = amount,
                }
            );
        form.Publications.Add(
            new PublicationFields
            {
                Category = "postscript",
                Title = "Postscript",
                MinisterialPoints = "99",
            }
        );
        form.SpubTasks.AddRange([
            new SpubTaskFields { Name = "First" },
            new SpubTaskFields { Name = "Second" },
        ]);
        var id = await CreateDraft(app, client, form);
        var evaluation = await client.GetFromJsonAsync<CruiseApplicationEvaluation>(
            $"/v2/applications/{id}/evaluation",
            ct
        );
        Assert.Equal(2, evaluation!.FormAContracts.Count);
        Assert.Equal(
            "150",
            Assert
                .Single(
                    evaluation.FormAContracts,
                    contract => contract.Contract.Category == "domestic"
                )
                .Points
        );
        Assert.Equal(
            "300",
            Assert
                .Single(
                    evaluation.FormAContracts,
                    contract => contract.Contract.Category == "international"
                )
                .Points
        );
        var publicationScores = new Dictionary<string, int>
        {
            ["0"] = 0,
            ["1"] = 0,
            ["99"] = 49,
            ["100"] = 50,
            ["Postscript"] = 99,
        };
        Assert.Equal(5, evaluation.FormAPublications.Count);
        foreach (var score in publicationScores)
            Assert.Equal(
                score.Value.ToString(System.Globalization.CultureInfo.InvariantCulture),
                Assert
                    .Single(
                        evaluation.FormAPublications,
                        publication => publication.Publication.Title == score.Key
                    )
                    .Points
            );
        Assert.Equal(2, evaluation.FormASpubTasks.Count);
        Assert.All(evaluation.FormASpubTasks, task => Assert.Equal("100", task.Points));
        await app.InDatabase(async db =>
        {
            var contracts = await db.Set<FormAContract>()
                .Include(contract => contract.Contract)
                .ToListAsync(ct);
            Assert.Equal(2, contracts.Count);
            Assert.Equal(
                150,
                Assert
                    .Single(contracts, contract => contract.Contract.Category == "domestic")
                    .Points
            );
            Assert.Equal(
                300,
                Assert
                    .Single(contracts, contract => contract.Contract.Category == "international")
                    .Points
            );
            var publications = await db
                .FormAPublications.Include(publication => publication.Publication)
                .ToListAsync(ct);
            Assert.Equal(5, publications.Count);
            foreach (var score in publicationScores)
                Assert.Equal(
                    score.Value,
                    Assert
                        .Single(
                            publications,
                            publication => publication.Publication.Title == score.Key
                        )
                        .Points
                );
            var tasks = await db.FormASpubTasks.ToListAsync(ct);
            Assert.Equal(2, tasks.Count);
            Assert.All(tasks, task => Assert.Equal(100, task.Points));
        });
        await AssertSummary(app, client, id, 848);
        form.Contracts.Clear();
        form.Publications.Clear();
        form.SpubTasks.Clear();
        await ReplaceDraft(client, id, form);
        evaluation = await client.GetFromJsonAsync<CruiseApplicationEvaluation>(
            $"/v2/applications/{id}/evaluation",
            ct
        );
        Assert.Empty(evaluation!.FormAContracts);
        Assert.Empty(evaluation.FormAPublications);
        Assert.Empty(evaluation.FormASpubTasks);
        await app.InDatabase(async db =>
        {
            Assert.Empty(await db.Set<FormAContract>().ToListAsync(ct));
            Assert.Empty(await db.FormAPublications.ToListAsync(ct));
            Assert.Empty(await db.FormASpubTasks.ToListAsync(ct));
        });
        await AssertSummary(app, client, id, 0);
    }

    [Theory]
    [InlineData(0, 0)]
    [InlineData(1, 0)]
    [InlineData(2, 50)]
    [InlineData(3, 100)]
    [InlineData(4, 100)]
    public async Task UgUnits_WhenParticipationCrossesBands_IgnoresEmptyTeams(int count, int points)
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var owner = await TestUsers.Create(app, "scoring@example.invalid", RoleName.CruiseManager);
        using var client = await TestApplications.Login(app, owner.Email!);
        var form = FormAccessTests.Draft(Guid.Parse(owner.Id));
        for (var index = 0; index <= count; index++)
        {
            var unit = new UgUnit { Name = $"Faculty {index}", IsActive = true };
            await app.InDatabase(async db =>
            {
                db.UgUnits.Add(unit);
                await db.SaveChangesAsync(ct);
            });
            form.UgTeams.Add(
                new UgTeamFields
                {
                    UgUnitId = unit.Id,
                    NoOfEmployees = index < count && index % 2 == 0 ? "1" : "0",
                    NoOfStudents = index < count && index % 2 == 1 ? "1" : "0",
                }
            );
        }
        var id = await CreateDraft(app, client, form);
        var evaluation = await client.GetFromJsonAsync<CruiseApplicationEvaluation>(
            $"/v2/applications/{id}/evaluation",
            ct
        );
        Assert.Equal(
            points.ToString(System.Globalization.CultureInfo.InvariantCulture),
            evaluation!.UgUnitsPoints
        );
        Assert.Equal(count + 1, evaluation.UgTeams.Count);
        await app.InDatabase(async db =>
        {
            var stored = await db.FormsA.Include(formA => formA.FormAUgUnits).SingleAsync(ct);
            Assert.Equal(
                points.ToString(System.Globalization.CultureInfo.InvariantCulture),
                stored.UgUnitsPoints
            );
            Assert.Equal(count + 1, stored.FormAUgUnits.Count);
        });
        await AssertSummary(app, client, id, points);
        form.UgTeams.RemoveRange(0, count);
        await ReplaceDraft(client, id, form);
        evaluation = await client.GetFromJsonAsync<CruiseApplicationEvaluation>(
            $"/v2/applications/{id}/evaluation",
            ct
        );
        Assert.Equal("0", evaluation!.UgUnitsPoints);
        Assert.Single(evaluation.UgTeams);
        await app.InDatabase(async db =>
        {
            Assert.Equal("0", (await db.FormsA.SingleAsync(ct)).UgUnitsPoints);
            Assert.Single(await db.FormAUgUnits.ToListAsync(ct));
        });
        await AssertSummary(app, client, id, 0);
    }

    [Fact]
    public async Task UgUnits_WhenCountsExceedSignedRange_PreservesCountsAndScoresNonemptyTeams()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var owner = await TestUsers.Create(app, "scoring@example.invalid", RoleName.CruiseManager);
        using var client = await TestApplications.Login(app, owner.Email!);
        var form = FormAccessTests.Draft(Guid.Parse(owner.Id));
        var counts = new[]
        {
            (Employees: "2147483648", Students: "0"),
            (Employees: "4294967295", Students: "0"),
            (Employees: "0", Students: "4294967295"),
        };
        foreach (var count in counts)
        {
            var unit = new UgUnit
            {
                Name = $"Faculty {count.Employees}/{count.Students}",
                IsActive = true,
            };
            await app.InDatabase(async db =>
            {
                db.UgUnits.Add(unit);
                await db.SaveChangesAsync(ct);
            });
            form.UgTeams.Add(
                new UgTeamFields
                {
                    UgUnitId = unit.Id,
                    NoOfEmployees = count.Employees,
                    NoOfStudents = count.Students,
                }
            );
        }
        var id = await CreateDraft(app, client, form);
        var evaluation = await client.GetFromJsonAsync<CruiseApplicationEvaluation>(
            $"/v2/applications/{id}/evaluation",
            ct
        );
        Assert.Equal("100", evaluation!.UgUnitsPoints);
        var read = await client.GetFromJsonAsync<FormAFields>($"/v2/applications/{id}/form-a", ct);
        Assert.Equal(3, read!.UgTeams.Count);
        await app.InDatabase(async db =>
        {
            var teams = await db.FormAUgUnits.Include(team => team.UgUnit).ToListAsync(ct);
            Assert.Equal(3, teams.Count);
            foreach (var expected in form.UgTeams)
            {
                var actual = Assert.Single(
                    read.UgTeams,
                    team => team.UgUnitId == expected.UgUnitId
                );
                Assert.Equal(expected.NoOfEmployees, actual.NoOfEmployees);
                Assert.Equal(expected.NoOfStudents, actual.NoOfStudents);
                var stored = Assert.Single(teams, team => team.UgUnit.Id == expected.UgUnitId);
                Assert.Equal(expected.NoOfEmployees, stored.NoOfEmployees);
                Assert.Equal(expected.NoOfStudents, stored.NoOfStudents);
            }
            Assert.Equal("100", (await db.FormsA.SingleAsync(ct)).UgUnitsPoints);
        });
        await AssertSummary(app, client, id, 100);
    }

    private static async Task<Guid> CreateDraft(
        TestApplication app,
        HttpClient client,
        FormAFields form
    )
    {
        using var response = await client.PostAsJsonAsync(
            "/v2/applications",
            new FormAWriteRequest { Form = form, Draft = true },
            TestContext.Current.CancellationToken
        );
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        Guid id = default;
        await app.InDatabase(async db =>
            id = (await db.CruiseApplications.SingleAsync(TestContext.Current.CancellationToken)).Id
        );
        return id;
    }

    private static async Task ReplaceDraft(HttpClient client, Guid id, FormAFields form)
    {
        using var response = await client.PutAsJsonAsync(
            $"/v2/applications/{id}/form-a",
            new FormAWriteRequest { Form = form, Draft = true },
            TestContext.Current.CancellationToken
        );
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
    }

    private static async Task AssertSummary(
        TestApplication app,
        HttpClient client,
        Guid id,
        int points
    )
    {
        var ct = TestContext.Current.CancellationToken;
        var summary = await client.GetFromJsonAsync<JsonElement>($"/v2/applications/{id}", ct);
        Assert.Equal(points, summary.GetProperty("points").GetInt32());
        await app.InDatabase(async db =>
        {
            Assert.Equal(
                CruiseApplicationStatus.Draft,
                (await db.CruiseApplications.SingleAsync(ct)).Status
            );
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        Assert.Empty(app.Transport.Messages);
    }

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
