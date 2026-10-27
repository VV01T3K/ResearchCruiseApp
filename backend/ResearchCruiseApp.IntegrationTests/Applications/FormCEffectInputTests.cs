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

    [Theory]
    [InlineData(null, ResearchTaskType.OwnResearchTask, 0)]
    [InlineData("", ResearchTaskType.OwnResearchTask, 0)]
    [InlineData("0", ResearchTaskType.OwnResearchTask, 0)]
    [InlineData("99", ResearchTaskType.OwnResearchTask, 49)]
    [InlineData("100", ResearchTaskType.OwnResearchTask, 50)]
    [InlineData("1000", ResearchTaskType.OwnResearchTask, 500)]
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
        Assert.Equal(HttpStatusCode.OK, draft.StatusCode);
        await app.InDatabase(async db => Assert.Empty(await db.UserEffects.ToListAsync(ct)));
        using var submitted = await Write(client, route, fields, false);
        Assert.Equal(HttpStatusCode.OK, submitted.StatusCode);
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
        client.PutFormAsync(
            route,
            new FormCWriteRequest { Form = fields, Draft = draft },
            TestContext.Current.CancellationToken
        );
}
