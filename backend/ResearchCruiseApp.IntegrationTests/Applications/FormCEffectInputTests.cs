using System.Globalization;
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
public sealed class FormCEffectInputTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    [Fact]
    public async Task Write_WhenEffectValueIsInvalid_ReturnsIndexedErrorAndPreservesDraft()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var application = await TestApplications.Create(app, CruiseApplicationStatus.Undertaken);
        var deputy = await TestUsers.Create(app, "deputy@example.invalid", RoleName.CruiseManager);
        await app.InDatabase(async db =>
        {
            var formA = await db.FormsA.SingleAsync(ct);
            formA.DeputyManagerId = Guid.Parse(deputy.Id);
            await db.SaveChangesAsync(ct);
        });
        using var client = await TestApplications.Login(app, application.OwnerEmail);
        var route = $"/v2/applications/{application.Id}/form-c";
        var original = Fields("99", "true", "true", "false", ResearchTaskType.OwnResearchTask);
        using var saved = await Write(client, route, original, true);
        Assert.Equal(HttpStatusCode.Created, saved.StatusCode);
        Guid formId = default;
        Guid effectId = default;
        Guid taskId = default;
        await app.InDatabase(async db =>
        {
            formId = (await db.FormsC.SingleAsync(ct)).Id;
            var effect = await db
                .ResearchTaskEffects.Include(row => row.ResearchTask)
                .SingleAsync(ct);
            effectId = effect.Id;
            taskId = effect.ResearchTask.Id;
        });
        foreach (var draft in new[] { true, false })
        foreach (var numeric in new[] { true, false })
        foreach (
            var value in numeric
                ? new[]
                {
                    "not-a-number",
                    "-1",
                    "NaN",
                    "Infinity",
                    "1.5",
                    "2147483648",
                    "4294967295",
                }
                : new[] { "banana", "1", "0", " false ", null }
        )
        {
            foreach (
                var field in numeric ? new[] { "points" } : new[] { "done", "manager", "deputy" }
            )
            {
                var fields = Fields(
                    numeric ? value : "99",
                    field == "done" ? value! : "true",
                    field == "manager" ? value! : "true",
                    field == "deputy" ? value! : "false",
                    ResearchTaskType.OwnResearchTask
                );
                using var response = await Write(client, route, fields, draft);
                Assert.True(
                    response.StatusCode == HttpStatusCode.BadRequest,
                    $"Draft={draft}, {field}={value ?? "null"}: {(int)response.StatusCode}"
                );
                Assert.Equal(
                    "application/problem+json",
                    response.Content.Headers.ContentType?.MediaType
                );
                using var problem = await JsonDocument.ParseAsync(
                    await response.Content.ReadAsStreamAsync(ct),
                    cancellationToken: ct
                );
                Assert.NotEmpty(
                    problem
                        .RootElement.GetProperty("errors")
                        .GetProperty(
                            value is null
                                ? $"form.researchTasksEffects[0].{(field == "done" ? "done" : field == "manager" ? "managerConditionMet" : "deputyConditionMet")}"
                                : "form.researchTasksEffects[0]"
                        )
                        .EnumerateArray()
                );
                using var read = await client.GetAsync(route, ct);
                Assert.Equal(HttpStatusCode.OK, read.StatusCode);
                var storedFields = (await read.Content.ReadFromJsonAsync<FormCFields>(ct))!;
                var storedEffect = Assert.Single(storedFields.ResearchTasksEffects);
                Assert.Equal("99", storedEffect.PublicationMinisterialPoints);
                Assert.Equal("true", storedEffect.Done);
                Assert.Equal("true", storedEffect.ManagerConditionMet);
                Assert.Equal("false", storedEffect.DeputyConditionMet);
                await app.InDatabase(async db =>
                {
                    Assert.Equal(formId, (await db.FormsC.SingleAsync(ct)).Id);
                    var effect = await db
                        .ResearchTaskEffects.Include(row => row.ResearchTask)
                        .SingleAsync(ct);
                    Assert.Equal(effectId, effect.Id);
                    Assert.Equal(taskId, effect.ResearchTask.Id);
                    Assert.Equal("99", effect.PublicationMinisterialPoints);
                    Assert.Equal("true", effect.Done);
                    Assert.Equal("true", effect.ManagerConditionMet);
                    Assert.Equal("false", effect.DeputyConditionMet);
                    Assert.Single(await db.ResearchTasks.ToListAsync(ct));
                    Assert.Empty(await db.UserEffects.ToListAsync(ct));
                    Assert.Equal(
                        CruiseApplicationStatus.Undertaken,
                        (await db.CruiseApplications.SingleAsync(ct)).Status
                    );
                    Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
                });
            }
        }
        await app.Dispatch(ct);
        Assert.Empty(app.Transport.Messages);
    }

    [Theory]
    [InlineData(null, ResearchTaskType.OwnResearchTask, 0)]
    [InlineData("", ResearchTaskType.OwnResearchTask, 0)]
    [InlineData("0", ResearchTaskType.OwnResearchTask, 0)]
    [InlineData("99", ResearchTaskType.OwnResearchTask, 49)]
    [InlineData("100", ResearchTaskType.OwnResearchTask, 50)]
    [InlineData("2147483647", ResearchTaskType.OwnResearchTask, 1_073_741_823)]
    [InlineData(null, ResearchTaskType.ProjectPreparation, 100)]
    [InlineData("", ResearchTaskType.ProjectPreparation, 100)]
    public async Task Submit_WhenPointsAreSupported_PreservesValuesAndScoresReport(
        string? points,
        ResearchTaskType type,
        int expected
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var application = await TestApplications.Create(app, CruiseApplicationStatus.Undertaken);
        var deputy = await TestUsers.Create(app, "deputy@example.invalid", RoleName.CruiseManager);
        Guid ownerId = default;
        await app.InDatabase(async db =>
        {
            var formA = await db.FormsA.SingleAsync(ct);
            ownerId = formA.CruiseManagerId;
            formA.DeputyManagerId = Guid.Parse(deputy.Id);
            await db.SaveChangesAsync(ct);
        });
        using var client = await TestApplications.Login(app, application.OwnerEmail);
        var route = $"/v2/applications/{application.Id}/form-c";
        var fields = Fields(points, "TrUe", "TRUE", "", type);
        using var draft = await Write(client, route, fields, true);
        Assert.Equal(HttpStatusCode.Created, draft.StatusCode);
        await app.InDatabase(async db => Assert.Empty(await db.UserEffects.ToListAsync(ct)));
        using var submitted = await Write(client, route, fields, false);
        Assert.Equal(HttpStatusCode.Created, submitted.StatusCode);
        using var read = await client.GetAsync(route, ct);
        Assert.Equal(HttpStatusCode.OK, read.StatusCode);
        var effect = Assert.Single(
            (await read.Content.ReadFromJsonAsync<FormCFields>(ct))!.ResearchTasksEffects
        );
        Assert.Equal(points, effect.PublicationMinisterialPoints);
        Assert.Equal("TrUe", effect.Done);
        Assert.Equal("TRUE", effect.ManagerConditionMet);
        Assert.Equal("", effect.DeputyConditionMet);
        await app.InDatabase(async db =>
        {
            Assert.Equal(
                CruiseApplicationStatus.Reported,
                (await db.CruiseApplications.SingleAsync(ct)).Status
            );
            Assert.Equal(
                points,
                (await db.ResearchTaskEffects.SingleAsync(ct)).PublicationMinisterialPoints
            );
            var evaluations = await db.UserEffects.ToListAsync(ct);
            Assert.Equal(2, evaluations.Count);
            Assert.Equal(expected, Assert.Single(evaluations, row => row.UserId == ownerId).Points);
            Assert.Equal(
                type == ResearchTaskType.ProjectPreparation ? 0 : expected,
                Assert.Single(evaluations, row => row.UserId == Guid.Parse(deputy.Id)).Points
            );
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        var scores = await client.GetFromJsonAsync<JsonElement>("/v2/users/me/cruise-effects", ct);
        Assert.Equal(
            expected.ToString(CultureInfo.InvariantCulture),
            Assert.Single(scores.EnumerateArray()).GetProperty("points").GetString()
        );
        await app.Dispatch(ct);
        Assert.Empty(app.Transport.Messages);
    }

    private static FormCFields Fields(
        string? points,
        string done,
        string manager,
        string deputy,
        ResearchTaskType type
    ) =>
        new()
        {
            ShipUsage = "0",
            DifferentUsage = "",
            ResearchTasksEffects =
            [
                new ResearchTaskEffectFields
                {
                    Type = ((int)type).ToString(CultureInfo.InvariantCulture),
                    Title = "Synthetic effect",
                    Done = done,
                    ManagerConditionMet = manager,
                    DeputyConditionMet = deputy,
                    PublicationMinisterialPoints = points,
                },
            ],
        };

    private static Task<HttpResponseMessage> Write(
        HttpClient client,
        string route,
        FormCFields fields,
        bool draft
    ) =>
        client.PutAsJsonAsync(
            route,
            new FormCWriteRequest { Form = fields, Draft = draft },
            TestContext.Current.CancellationToken
        );
}
