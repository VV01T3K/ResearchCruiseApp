using System.Net;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Api.Users;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Applications;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class CruiseEffectScoringTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    // BE-SCORING-007/008: completion scores each manager, replacement removes old effects,
    // and final Form A includes only its manager's historical effects.
    [Fact]
    public async Task Effects_WhenSubmittedThenReplaced_ScoreBothManagersAndFeedNextApplication()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var application = await TestApplications.Create(app, CruiseApplicationStatus.Undertaken);
        var deputy = await TestUsers.Create(app, "deputy@example.invalid", RoleName.CruiseManager);
        var unrelated = await TestUsers.Create(
            app,
            "unrelated@example.invalid",
            RoleName.CruiseManager
        );
        var office = await TestUsers.Create(app, "office@example.invalid", RoleName.Shipowner);
        Guid managerId = default;
        var deputyId = Guid.Parse(deputy.Id);
        var unit = new UgUnit { Name = "Effects faculty", IsActive = true };
        await app.InDatabase(async db =>
        {
            var stored = await db.CruiseApplications.Include(row => row.FormA).SingleAsync(ct);
            managerId = stored.FormA!.CruiseManagerId;
            stored.FormA.DeputyManagerId = deputyId;
            stored.FormA.FormAResearchTasks.Add(
                new FormAResearchTask
                {
                    ResearchTask = new ResearchTask
                    {
                        Type = ResearchTaskType.OtherResearchTask,
                        Title = "Other research",
                        FinancingApproved = null,
                    },
                    Points = 73,
                }
            );
            db.UgUnits.Add(unit);
            await db.SaveChangesAsync(ct);
        });
        var cases = new[]
        {
            (
                Title: "Bachelor manager",
                Type: "0",
                Done: "true",
                Publication: (string?)null,
                Manager: "true",
                Deputy: "false",
                ManagerPoints: 20,
                DeputyPoints: 0
            ),
            (
                Title: "Master deputy",
                Type: "1",
                Done: "true",
                Publication: (string?)null,
                Manager: "false",
                Deputy: "true",
                ManagerPoints: 0,
                DeputyPoints: 50
            ),
            (
                Title: "Doctoral both",
                Type: "2",
                Done: "true",
                Publication: (string?)null,
                Manager: "true",
                Deputy: "true",
                ManagerPoints: 200,
                DeputyPoints: 200
            ),
            (
                Title: "Undone",
                Type: "2",
                Done: "false",
                Publication: (string?)null,
                Manager: "true",
                Deputy: "true",
                ManagerPoints: 0,
                DeputyPoints: 0
            ),
            (
                Title: "Preparation below",
                Type: "3",
                Done: "true",
                Publication: "99",
                Manager: "false",
                Deputy: "false",
                ManagerPoints: 0,
                DeputyPoints: 0
            ),
            (
                Title: "Preparation threshold",
                Type: "3",
                Done: "true",
                Publication: "100",
                Manager: "false",
                Deputy: "false",
                ManagerPoints: 100,
                DeputyPoints: 100
            ),
            (
                Title: "Preparation manager",
                Type: "3",
                Done: "true",
                Publication: "99",
                Manager: "true",
                Deputy: "false",
                ManagerPoints: 100,
                DeputyPoints: 0
            ),
            (
                Title: "Domestic",
                Type: "4",
                Done: "true",
                Publication: "99",
                Manager: "false",
                Deputy: "false",
                ManagerPoints: 49,
                DeputyPoints: 49
            ),
            (
                Title: "Foreign",
                Type: "5",
                Done: "true",
                Publication: "99",
                Manager: "false",
                Deputy: "false",
                ManagerPoints: 49,
                DeputyPoints: 49
            ),
            (
                Title: "Internal",
                Type: "6",
                Done: "true",
                Publication: "99",
                Manager: "false",
                Deputy: "false",
                ManagerPoints: 49,
                DeputyPoints: 49
            ),
            (
                Title: "Other project",
                Type: "7",
                Done: "true",
                Publication: "99",
                Manager: "false",
                Deputy: "false",
                ManagerPoints: 49,
                DeputyPoints: 49
            ),
            (
                Title: "Own research",
                Type: "10",
                Done: "true",
                Publication: "99",
                Manager: "false",
                Deputy: "false",
                ManagerPoints: 49,
                DeputyPoints: 49
            ),
            (
                Title: "Other research",
                Type: "11",
                Done: "true",
                Publication: (string?)null,
                Manager: "false",
                Deputy: "false",
                ManagerPoints: 73,
                DeputyPoints: 73
            ),
            (
                Title: "Commercial",
                Type: "8",
                Done: "true",
                Publication: "99",
                Manager: "true",
                Deputy: "true",
                ManagerPoints: 0,
                DeputyPoints: 0
            ),
            (
                Title: "Didactics",
                Type: "9",
                Done: "true",
                Publication: "99",
                Manager: "true",
                Deputy: "true",
                ManagerPoints: 0,
                DeputyPoints: 0
            ),
        };
        var fields = new FormCFields { ShipUsage = "0", DifferentUsage = "" };
        foreach (var item in cases)
            fields.ResearchTasksEffects.Add(
                new ResearchTaskEffectFields
                {
                    Type = item.Type,
                    Title = item.Title,
                    Done = item.Done,
                    PublicationMinisterialPoints = item.Publication,
                    ManagerConditionMet = item.Manager,
                    DeputyConditionMet = item.Deputy,
                }
            );
        using var manager = await TestApplications.Login(app, application.OwnerEmail);
        using var deputyClient = await TestApplications.Login(app, deputy.Email!);
        using var unrelatedClient = await TestApplications.Login(app, unrelated.Email!);
        var route = $"/v2/applications/{application.Id}/form-c";
        using var draft = await manager.PutAsJsonAsync(
            route,
            new FormCWriteRequest { Form = fields, Draft = true },
            ct
        );
        Assert.Equal(HttpStatusCode.Created, draft.StatusCode);
        await app.InDatabase(async db =>
        {
            Assert.Empty(await db.UserEffects.ToListAsync(ct));
            Assert.Equal(15, await db.ResearchTaskEffects.CountAsync(ct));
            Assert.Equal(
                CruiseApplicationStatus.Undertaken,
                (await db.CruiseApplications.SingleAsync(ct)).Status
            );
        });
        Assert.Empty(
            (
                await manager.GetFromJsonAsync<List<CruiseEffectResponse>>(
                    "/v2/users/me/cruise-effects",
                    ct
                )
            )!
        );
        using var submitted = await manager.PutAsJsonAsync(
            route,
            new FormCWriteRequest { Form = fields, Draft = false },
            ct
        );
        Assert.Equal(HttpStatusCode.Created, submitted.StatusCode);
        await app.InDatabase(async db =>
        {
            var beforeCruise = await db
                .FormAResearchTasks.Include(task => task.ResearchTask)
                .SingleAsync(task => task.ResearchTask.Title == "Other research", ct);
            var afterCruise = await db
                .ResearchTaskEffects.Include(effect => effect.ResearchTask)
                .SingleAsync(effect => effect.ResearchTask.Title == "Other research", ct);
            Assert.Equal(beforeCruise.ResearchTask.Id, afterCruise.ResearchTask.Id);
            Assert.Equal(73, beforeCruise.Points);
        });
        var managerScores = cases.ToDictionary(item => item.Title, item => item.ManagerPoints);
        var deputyScores = cases.ToDictionary(item => item.Title, item => item.DeputyPoints);
        await AssertEffects(app, manager, application.Id, managerId, managerScores);
        await AssertEffects(app, deputyClient, application.Id, deputyId, deputyScores);
        Assert.Empty(
            (
                await unrelatedClient.GetFromJsonAsync<List<CruiseEffectResponse>>(
                    "/v2/users/me/cruise-effects",
                    ct
                )
            )!
        );
        await app.InDatabase(async db =>
        {
            Assert.Equal(30, await db.UserEffects.CountAsync(ct));
            Assert.Equal(15, await db.ResearchTaskEffects.CountAsync(ct));
            Assert.Equal(
                CruiseApplicationStatus.Reported,
                (await db.CruiseApplications.SingleAsync(ct)).Status
            );
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });

        // BE-SCORING-008: draft excludes historical effects; final submission takes 738,
        // not the combined manager/deputy total of 1406.
        var nextForm = FormAWorkflowTests.CompleteForm(managerId, deputyId, unit.Id);
        using var nextDraft = await manager.PostAsJsonAsync(
            "/v2/applications",
            new FormAWriteRequest { Form = nextForm, Draft = true },
            ct
        );
        Assert.Equal(HttpStatusCode.Created, nextDraft.StatusCode);
        Guid nextId = default;
        await app.InDatabase(async db =>
        {
            var next = await db.CruiseApplications.SingleAsync(row => row.Id != application.Id, ct);
            nextId = next.Id;
            Assert.Equal(0, next.EffectsPoints);
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        Assert.Equal(
            "0",
            (
                await manager.GetFromJsonAsync<CruiseApplicationEvaluation>(
                    $"/v2/applications/{nextId}/evaluation",
                    ct
                )
            )!.EffectsPoints
        );
        using var final = await manager.PutAsJsonAsync(
            $"/v2/applications/{nextId}/form-a",
            new FormAWriteRequest { Form = nextForm, Draft = false },
            ct
        );
        Assert.Equal(HttpStatusCode.NoContent, final.StatusCode);
        Assert.Equal(
            "738",
            (
                await manager.GetFromJsonAsync<CruiseApplicationEvaluation>(
                    $"/v2/applications/{nextId}/evaluation",
                    ct
                )
            )!.EffectsPoints
        );
        await app.InDatabase(async db =>
        {
            var next = await db.CruiseApplications.SingleAsync(row => row.Id == nextId, ct);
            Assert.Equal(738, next.EffectsPoints);
            Assert.Equal(CruiseApplicationStatus.WaitingForSupervisor, next.Status);
            Assert.Single(await db.EmailOutboxMessages.ToListAsync(ct));
        });

        using var officeClient = await TestApplications.Login(app, office.Email!);
        using var refill = await officeClient.PutAsync(route + "/refill", null, ct);
        Assert.Equal(HttpStatusCode.NoContent, refill.StatusCode);
        fields.ResearchTasksEffects.Clear();
        fields.ResearchTasksEffects.Add(
            new ResearchTaskEffectFields
            {
                Type = "2",
                Title = "Replacement doctoral",
                Done = "true",
                ManagerConditionMet = "true",
                DeputyConditionMet = "false",
            }
        );
        using var replaced = await manager.PutAsJsonAsync(
            route,
            new FormCWriteRequest { Form = fields, Draft = false },
            ct
        );
        Assert.Equal(HttpStatusCode.Created, replaced.StatusCode);
        await AssertEffects(
            app,
            manager,
            application.Id,
            managerId,
            new Dictionary<string, int> { ["Replacement doctoral"] = 200 }
        );
        await AssertEffects(
            app,
            deputyClient,
            application.Id,
            deputyId,
            new Dictionary<string, int> { ["Replacement doctoral"] = 0 }
        );
        await app.InDatabase(async db =>
        {
            Assert.Equal(2, await db.UserEffects.CountAsync(ct));
            Assert.Single(await db.ResearchTaskEffects.ToListAsync(ct));
            Assert.Single(await db.EmailOutboxMessages.ToListAsync(ct));
            Assert.Equal(
                738,
                (await db.CruiseApplications.SingleAsync(row => row.Id == nextId, ct)).EffectsPoints
            );
        });
        Assert.Empty(app.Transport.Messages);
    }

    private static async Task AssertEffects(
        TestApplication app,
        HttpClient client,
        Guid applicationId,
        Guid userId,
        Dictionary<string, int> expected
    )
    {
        var ct = TestContext.Current.CancellationToken;
        var effects = await client.GetFromJsonAsync<List<CruiseEffectResponse>>(
            "/v2/users/me/cruise-effects",
            ct
        );
        Assert.Equal(expected.Count, effects!.Count);
        foreach (var score in expected)
        {
            var effect = Assert.Single(effects, effect => effect.Effect.Title == score.Key);
            Assert.Equal(
                score.Value.ToString(System.Globalization.CultureInfo.InvariantCulture),
                effect.Points
            );
            Assert.Equal(userId, effect.UserId);
            Assert.Equal(applicationId.ToString(), effect.CruiseApplicationId);
        }
        await app.InDatabase(async db =>
        {
            var stored = await db
                .UserEffects.Include(effect => effect.Effect.ResearchTask)
                .Include(effect => effect.Effect.FormC.CruiseApplication)
                .Where(effect => effect.UserId == userId)
                .ToListAsync(ct);
            Assert.Equal(expected.Count, stored.Count);
            foreach (var score in expected)
            {
                var effect = Assert.Single(
                    stored,
                    effect => effect.Effect.ResearchTask.Title == score.Key
                );
                Assert.Equal(score.Value, effect.Points);
                Assert.Equal(applicationId, effect.Effect.FormC.CruiseApplication.Id);
            }
        });
    }
}
