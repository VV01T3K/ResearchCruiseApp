using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.IntegrationTests.Infrastructure;
using static ResearchCruiseApp.IntegrationTests.Infrastructure.FormRequests;

namespace ResearchCruiseApp.IntegrationTests.Applications;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class FormCollectionInputTests(SqlFixture fixture) : IAsyncLifetime
{
    private static readonly string[] FormBCollections =
    [
        "Permissions",
        "UgTeams",
        "GuestTeams",
        "CrewMembers",
        "ShortResearchEquipments",
        "LongResearchEquipments",
        "Ports",
        "CruiseDaysDetails",
        "ResearchEquipments",
        "ShipEquipmentsIds",
    ];

    private static readonly string[] FormCCollections =
    [
        "Permissions",
        "ResearchAreaDescriptions",
        "UgTeams",
        "GuestTeams",
        "ResearchTasksEffects",
        "Contracts",
        "SpubTasks",
        "ShortResearchEquipments",
        "LongResearchEquipments",
        "Ports",
        "CruiseDaysDetails",
        "ResearchEquipments",
        "ShipEquipmentsIds",
        "CollectedSamples",
        "Photos",
    ];

    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    [Theory]
    [InlineData(false, true)]
    [InlineData(false, false)]
    [InlineData(true, true)]
    [InlineData(true, false)]
    public async Task Write_WhenCollectionsAreOmittedOrEmpty_SavesAndCanSubmit(
        bool formC,
        bool explicitEmpty
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var application = await TestApplications.Create(
            app,
            formC ? CruiseApplicationStatus.Undertaken : CruiseApplicationStatus.FormBRequired
        );
        using var client = await TestApplications.Login(app, application.OwnerEmail);
        var route = $"/v2/applications/{application.Id}/form-{(formC ? "c" : "b")}";
        var fields = Fields(formC);
        var properties = formC ? FormCCollections : FormBCollections;
        if (explicitEmpty)
            foreach (var property in properties)
                fields[property] = new JsonArray();
        foreach (var draft in new[] { true, false })
        {
            using var response = await client.PutFormAsync(
                route,
                new { Form = fields, Draft = draft },
                ct
            );
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            using var read = await client.GetAsync(route, ct);
            Assert.Equal(HttpStatusCode.OK, read.StatusCode);
            using var body = await JsonDocument.ParseAsync(
                await read.Content.ReadAsStreamAsync(ct),
                cancellationToken: ct
            );
            foreach (var property in properties)
            {
                var jsonName = char.ToLowerInvariant(property[0]) + property[1..];
                Assert.Empty(body.RootElement.GetProperty(jsonName).EnumerateArray());
            }
            await app.InDatabase(async db =>
            {
                Assert.Equal(
                    draft
                        ? (
                            formC
                                ? CruiseApplicationStatus.Undertaken
                                : CruiseApplicationStatus.FormBRequired
                        )
                        : (
                            formC
                                ? CruiseApplicationStatus.Reported
                                : CruiseApplicationStatus.FormBFilled
                        ),
                    (await db.CruiseApplications.SingleAsync(ct)).Status
                );
                Assert.Empty(await db.Permissions.ToListAsync(ct));
                Assert.Empty(await db.ContractFiles.ToListAsync(ct));
                Assert.Empty(await db.Photos.ToListAsync(ct));
                Assert.Empty(await db.ResearchTaskEffects.ToListAsync(ct));
                Assert.Empty(await db.UserEffects.ToListAsync(ct));
                Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
            });
        }
        await app.Dispatch(ct);
        Assert.Empty(app.Transport.Messages);
    }

    private static JsonObject Fields(bool formC) =>
        formC
            ? new JsonObject { ["ShipUsage"] = "0", ["DifferentUsage"] = "" }
            : new JsonObject { ["IsCruiseManagerPresent"] = "true" };
}
