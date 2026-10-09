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

    // BE-FORM-COLLECTION-001/002: explicit null lists/items cannot replace saved B/C drafts.
    // Drafts only: final submission runs the same rule, so repeating it adds runtime, not coverage.
    // Each case covers one form; null lists and null items run on the same host.
    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public async Task Write_WhenCollectionOrItemIsNull_ReturnsFieldErrorAndPreservesDraft(
        bool formC
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var status = formC
            ? CruiseApplicationStatus.Undertaken
            : CruiseApplicationStatus.FormBRequired;
        var application = await TestApplications.Create(app, status);
        using var client = await TestApplications.Login(app, application.OwnerEmail);
        var route = $"/v2/applications/{application.Id}/form-{(formC ? "c" : "b")}";
        var original = Fields(formC);
        original["Permissions"] = new JsonArray(
            new JsonObject
            {
                ["Description"] = "Saved sampling approval",
                ["Executive"] = "Synthetic authority",
            }
        );
        using var saved = await client.PutAsJsonAsync(
            route,
            new { Form = original, Draft = true },
            ct
        );
        Assert.Equal(HttpStatusCode.Created, saved.StatusCode);
        var snapshot = await Read(client, route);
        Guid formId = default;
        Guid permissionId = default;
        await app.InDatabase(async db =>
        {
            formId = formC
                ? (await db.FormsC.SingleAsync(ct)).Id
                : (await db.FormsB.SingleAsync(ct)).Id;
            permissionId = (await db.Permissions.SingleAsync(ct)).Id;
        });

        var failures = new List<string>();
        foreach (var item in new[] { false, true })
        foreach (var property in formC ? FormCCollections : FormBCollections)
        {
            // Guid entries already reject JSON null during binding; reference entries need validation.
            if (item && property == "ShipEquipmentsIds")
                continue;
            var fields = Fields(formC);
            fields[property] = item ? new JsonArray((JsonNode?)null) : null;
            using var response = await client.PutAsJsonAsync(
                route,
                new { Form = fields, Draft = true },
                ct
            );
            if (response.StatusCode != HttpStatusCode.BadRequest)
                failures.Add($"{property}{(item ? "[0]" : "")}: {(int)response.StatusCode}");
            else
            {
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
                            $"form.{JsonNamingPolicy.CamelCase.ConvertName(property)}{(item ? "[0]" : "")}"
                        )
                        .EnumerateArray()
                );
            }
            Assert.Equal(snapshot, await Read(client, route));
            await app.InDatabase(async db =>
            {
                var stored = await db.CruiseApplications.SingleAsync(ct);
                Assert.Equal(application.Id, stored.Id);
                Assert.Equal(status, stored.Status);
                Assert.Single(await db.FormsA.ToListAsync(ct));
                if (formC)
                {
                    Assert.Equal(formId, (await db.FormsC.SingleAsync(ct)).Id);
                    Assert.Empty(await db.FormsB.ToListAsync(ct));
                }
                else
                {
                    Assert.Equal(formId, (await db.FormsB.SingleAsync(ct)).Id);
                    Assert.Empty(await db.FormsC.ToListAsync(ct));
                }
                var permission = await db.Permissions.SingleAsync(ct);
                Assert.Equal(permissionId, permission.Id);
                Assert.Equal("Saved sampling approval", permission.Description);
                Assert.Equal("Synthetic authority", permission.Executive);
                Assert.Empty(await db.ContractFiles.ToListAsync(ct));
                Assert.Empty(await db.Photos.ToListAsync(ct));
                Assert.Empty(await db.ResearchTasks.ToListAsync(ct));
                Assert.Empty(await db.ResearchTaskEffects.ToListAsync(ct));
                Assert.Empty(await db.UserEffects.ToListAsync(ct));
                Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
            });
        }
        await app.Dispatch(ct);
        Assert.Empty(app.Transport.Messages);
        Assert.True(failures.Count == 0, string.Join("; ", failures));
    }

    // BE-FORM-COLLECTION-003: omitted and empty lists retain their supported empty semantics.
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
            using var response = await client.PutAsJsonAsync(
                route,
                new { Form = fields, Draft = draft },
                ct
            );
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
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
