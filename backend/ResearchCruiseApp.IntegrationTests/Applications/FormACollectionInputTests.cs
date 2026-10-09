using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.IntegrationTests.Infrastructure;
using static ResearchCruiseApp.IntegrationTests.Infrastructure.FormRequests;

namespace ResearchCruiseApp.IntegrationTests.Applications;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class FormACollectionInputTests(SqlFixture fixture) : IAsyncLifetime
{
    private static readonly string[] Collections =
    [
        "Permissions",
        "ResearchAreaDescriptions",
        "ResearchTasks",
        "Contracts",
        "UgTeams",
        "GuestTeams",
        "Publications",
        "SpubTasks",
    ];
    private static readonly string[] OptionalCollections =
    [
        "Permissions",
        "Contracts",
        "GuestTeams",
        "Publications",
        "SpubTasks",
    ];
    private const string OwnerEmail = "collection-owner@example.invalid";
    private const string FileContent = "U3ludGhldGljIGNvbnRyYWN0";

    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    // BE-FORM-COLLECTION-004: both Form A routes reject null lists/items without business writes.
    // Drafts only: final submission runs the same rule, so repeating it adds runtime, not coverage.
    // Each case covers one route; null lists and null items run on the same host.
    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public async Task Write_WhenCollectionOrItemIsNull_RejectsWithoutBusinessChanges(bool create)
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var prepared = await Prepare(app, create ? 0 : 1);
        using var client = prepared.Client;
        var original = await Snapshot(app);
        var originalHttp = create ? null : await Read(client, prepared.Route);
        var failures = new List<string>();
        foreach (var item in new[] { false, true })
        foreach (var property in Collections)
        {
            var fields = (JsonObject)prepared.Fields.DeepClone();
            fields[property] = item ? new JsonArray((JsonNode?)null) : null;
            using var response = await Write(client, prepared.Route, fields, true, create);
            await CheckRejection(
                response,
                $"form.{JsonNamingPolicy.CamelCase.ConvertName(property)}{(item ? "[0]" : "")}",
                failures
            );
            Assert.Equal(original, await Snapshot(app));
            if (!create)
                Assert.Equal(originalHttp, await Read(client, prepared.Route));
        }
        await app.Dispatch(ct);
        Assert.Empty(app.Transport.Messages);
        Assert.True(failures.Count == 0, string.Join("; ", failures));
    }

    // BE-FORM-COLLECTION-006: nested scan lists/items are shared by A create/update and C update.
    // Drafts only: final submission runs the same rule, so repeating it adds runtime, not coverage.
    // Each case covers one route; a null scan list and a null scan item run on the same host.
    [Theory]
    [InlineData(0)]
    [InlineData(1)]
    [InlineData(2)]
    public async Task Write_WhenContractScanStructureIsNull_RejectsWithoutBusinessChanges(
        int target
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var prepared = await Prepare(app, target);
        using var client = prepared.Client;
        var original = await Snapshot(app);
        var originalHttp = target == 0 ? null : await Read(client, prepared.Route);
        var failures = new List<string>();
        foreach (var item in new[] { false, true })
        {
            var fields = (JsonObject)prepared.Fields.DeepClone();
            var contract = fields["Contracts"]![0]!;
            // A valid preceding upload proves that the error identifies the actual nested index.
            contract["Scans"] = item ? new JsonArray(Scan(), null) : null;
            using var response = await Write(client, prepared.Route, fields, true, target == 0);
            await CheckRejection(
                response,
                $"form.contracts[0].scans{(item ? "[1]" : "")}",
                failures
            );
            Assert.Equal(original, await Snapshot(app));
            if (target != 0)
                Assert.Equal(originalHttp, await Read(client, prepared.Route));
        }
        await app.Dispatch(ct);
        Assert.Empty(app.Transport.Messages);
        Assert.True(failures.Count == 0, string.Join("; ", failures));
    }

    // BE-FORM-COLLECTION-005: empty/omitted drafts remain supported; final completeness still applies.
    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public async Task Draft_WhenCollectionsAreOmittedOrEmpty_SavesButFinalCompletenessStillApplies(
        bool explicitEmpty
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var prepared = await Prepare(app, 0);
        using var client = prepared.Client;
        var fields = (JsonObject)prepared.Fields.DeepClone();
        foreach (var property in Collections)
            if (explicitEmpty)
                fields[property] = new JsonArray();
            else
                fields.Remove(property);
        fields["PrecisePeriodStart"] = null;
        fields["PrecisePeriodEnd"] = null;
        fields["AcceptablePeriod"] = null;
        fields["OptimalPeriod"] = null;
        using var created = await Write(client, prepared.Route, fields, true, true);
        Assert.Equal(HttpStatusCode.Created, created.StatusCode);
        var id = await ApplicationId(app);
        var route = $"/v2/applications/{id}/form-a";
        using var updated = await Write(client, route, fields, true, false);
        Assert.Equal(HttpStatusCode.NoContent, updated.StatusCode);
        using var read = await client.GetAsync(route, ct);
        var stored = (await read.Content.ReadFromJsonAsync<FormAFields>(ct))!;
        Assert.Null(stored.AcceptablePeriod);
        Assert.Null(stored.OptimalPeriod);
        var node = JsonSerializer.SerializeToNode(stored)!;
        foreach (var property in Collections)
            Assert.Empty(node[property]!.AsArray());
        var original = await Snapshot(app);
        using var rejected = await Write(client, route, fields, false, false);
        Assert.Equal(HttpStatusCode.BadRequest, rejected.StatusCode);
        using var problem = await JsonDocument.ParseAsync(
            await rejected.Content.ReadAsStreamAsync(ct),
            cancellationToken: ct
        );
        foreach (var property in new[] { "ResearchAreaDescriptions", "ResearchTasks", "UgTeams" })
            Assert.NotEmpty(
                problem
                    .RootElement.GetProperty("errors")
                    .GetProperty($"form.{JsonNamingPolicy.CamelCase.ConvertName(property)}")
                    .EnumerateArray()
            );
        Assert.Equal(original, await Snapshot(app));
        await app.InDatabase(async db =>
        {
            Assert.Equal(
                CruiseApplicationStatus.Draft,
                (await db.CruiseApplications.SingleAsync(ct)).Status
            );
            Assert.Single(await db.FormsA.ToListAsync(ct));
            Assert.Empty(await db.Contracts.ToListAsync(ct));
            Assert.Empty(await db.ContractFiles.ToListAsync(ct));
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        await app.Dispatch(ct);
        Assert.Empty(app.Transport.Messages);
    }

    // BE-FORM-COLLECTION-005: optional empty lists do not prevent a complete final submission.
    [Theory]
    [InlineData(true, true)]
    [InlineData(true, false)]
    [InlineData(false, true)]
    [InlineData(false, false)]
    public async Task Submit_WhenOptionalCollectionsAreOmittedOrEmpty_PersistsInvitation(
        bool create,
        bool explicitEmpty
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var prepared = await Prepare(app, create ? 0 : 1);
        using var client = prepared.Client;
        var fields = (JsonObject)prepared.Fields.DeepClone();
        foreach (var property in OptionalCollections)
            if (explicitEmpty)
                fields[property] = new JsonArray();
            else
                fields.Remove(property);
        using var response = await Write(client, prepared.Route, fields, false, create);
        Assert.Equal(
            create ? HttpStatusCode.Created : HttpStatusCode.NoContent,
            response.StatusCode
        );
        var id = await ApplicationId(app);
        var stored = await client.GetFromJsonAsync<FormAFields>(
            $"/v2/applications/{id}/form-a",
            ct
        );
        Assert.NotNull(stored);
        Assert.Null(stored.AcceptablePeriod);
        Assert.Null(stored.OptimalPeriod);
        Assert.Equal("Synthetic thesis", Assert.Single(stored.ResearchTasks).Title);
        Assert.Equal(
            "Synthetic area",
            Assert.Single(stored.ResearchAreaDescriptions).DifferentName
        );
        Assert.Equal("2", Assert.Single(stored.UgTeams).NoOfEmployees);
        var node = JsonSerializer.SerializeToNode(stored)!;
        foreach (var property in OptionalCollections)
            Assert.Empty(node[property]!.AsArray());
        await app.InDatabase(async db =>
        {
            Assert.Equal(
                CruiseApplicationStatus.WaitingForSupervisor,
                (await db.CruiseApplications.SingleAsync(ct)).Status
            );
            Assert.Single(await db.FormsA.ToListAsync(ct));
            Assert.Single(await db.ResearchTasks.ToListAsync(ct));
            Assert.Single(await db.ResearchAreaDescriptions.ToListAsync(ct));
            Assert.Single(await db.FormAUgUnits.ToListAsync(ct));
            Assert.Empty(await db.Contracts.ToListAsync(ct));
            Assert.Empty(await db.ContractFiles.ToListAsync(ct));
            Assert.Single(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        Assert.Empty(app.Transport.Messages);
        await app.Dispatch(ct);
        Assert.Equal(
            "supervisor@example.invalid",
            Assert.Single(app.Transport.Messages).Payload.Recipient
        );
        await app.InDatabase(async db =>
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct))
        );
    }

    // BE-FORM-COLLECTION-006: omitted/empty nested scan lists remain supported by both forms.
    [Theory]
    [InlineData(false, true)]
    [InlineData(false, false)]
    [InlineData(true, true)]
    [InlineData(true, false)]
    public async Task Write_WhenContractScansAreOmittedOrEmpty_SavesDraft(
        bool formC,
        bool explicitEmpty
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var prepared = await Prepare(app, formC ? 2 : 1);
        using var client = prepared.Client;
        var fields = (JsonObject)prepared.Fields.DeepClone();
        var contract = fields["Contracts"]![0]!.AsObject();
        if (explicitEmpty)
            contract["Scans"] = new JsonArray();
        else
            contract.Remove("Scans");
        using var response = await Write(client, prepared.Route, fields, true, false);
        Assert.Equal(
            formC ? HttpStatusCode.Created : HttpStatusCode.NoContent,
            response.StatusCode
        );
        using var read = await client.GetAsync(prepared.Route, ct);
        Assert.Equal(HttpStatusCode.OK, read.StatusCode);
        using var body = await JsonDocument.ParseAsync(
            await read.Content.ReadAsStreamAsync(ct),
            cancellationToken: ct
        );
        var stored = Assert.Single(body.RootElement.GetProperty("contracts").EnumerateArray());
        Assert.Equal("Synthetic agreement", stored.GetProperty("description").GetString());
        Assert.Empty(stored.GetProperty("scans").EnumerateArray());
        await app.InDatabase(async db =>
        {
            Assert.Single(await db.Contracts.ToListAsync(ct));
            Assert.Empty(await db.ContractFiles.ToListAsync(ct));
            Assert.Equal(
                formC ? CruiseApplicationStatus.Undertaken : CruiseApplicationStatus.Draft,
                (await db.CruiseApplications.SingleAsync(ct)).Status
            );
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        await app.Dispatch(ct);
        Assert.Empty(app.Transport.Messages);
    }

    private static async Task<(HttpClient Client, JsonObject Fields, string Route)> Prepare(
        TestApplication app,
        int target
    )
    {
        var ct = TestContext.Current.CancellationToken;
        JsonObject fields;
        Guid id = default;
        if (target == 2)
        {
            var application = await TestApplications.Create(
                app,
                CruiseApplicationStatus.Undertaken,
                OwnerEmail
            );
            id = application.Id;
            fields = new JsonObject { ["ShipUsage"] = "0", ["DifferentUsage"] = "" };
        }
        else
        {
            var owner = await TestUsers.Create(app, OwnerEmail, RoleName.CruiseManager);
            var deputy = await TestUsers.Create(
                app,
                "collection-deputy@example.invalid",
                RoleName.CruiseManager
            );
            var unit = new UgUnit { Name = "Collection faculty", IsActive = true };
            await app.InDatabase(async db =>
            {
                db.UgUnits.Add(unit);
                await db.SaveChangesAsync(ct);
            });
            fields = JsonSerializer
                .SerializeToNode(
                    FormAWorkflowTests.CompleteForm(
                        Guid.Parse(owner.Id),
                        Guid.Parse(deputy.Id),
                        unit.Id
                    )
                )!
                .AsObject();
            fields["Note"] = "Original collection draft";
        }
        fields["Contracts"] = new JsonArray(
            new JsonObject
            {
                ["Category"] = ContractCategory.Domestic,
                ["InstitutionName"] = "Synthetic institution",
                ["InstitutionUnit"] = "Synthetic unit",
                ["InstitutionLocalization"] = "Synthetic location",
                ["Description"] = "Synthetic agreement",
                ["Scans"] = new JsonArray(Scan()),
            }
        );
        var client = await TestApplications.Login(app, OwnerEmail);
        try
        {
            if (target == 1)
            {
                using var saved = await Write(client, "/v2/applications", fields, true, true);
                Assert.Equal(HttpStatusCode.Created, saved.StatusCode);
                id = await ApplicationId(app);
            }
            var route =
                target == 0
                    ? "/v2/applications"
                    : $"/v2/applications/{id}/form-{(target == 2 ? "c" : "a")}";
            if (target == 2)
            {
                using var saved = await Write(client, route, fields, true, false);
                Assert.Equal(HttpStatusCode.Created, saved.StatusCode);
            }
            return (client, fields, route);
        }
        catch
        {
            client.Dispose();
            throw;
        }
    }

    private static JsonObject Scan() =>
        new() { ["Name"] = "original.txt", ["Content"] = FileContent };

    private static async Task CheckRejection(
        HttpResponseMessage response,
        string property,
        List<string> failures
    )
    {
        var ct = TestContext.Current.CancellationToken;
        if (response.StatusCode != HttpStatusCode.BadRequest)
        {
            failures.Add($"{property}: {(int)response.StatusCode}");
            return;
        }
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);
        using var problem = await JsonDocument.ParseAsync(
            await response.Content.ReadAsStreamAsync(ct),
            cancellationToken: ct
        );
        Assert.NotEmpty(
            problem.RootElement.GetProperty("errors").GetProperty(property).EnumerateArray()
        );
    }

    private static async Task<Guid> ApplicationId(TestApplication app)
    {
        Guid id = default;
        await app.InDatabase(async db =>
            id = (await db.CruiseApplications.SingleAsync(TestContext.Current.CancellationToken)).Id
        );
        return id;
    }
}
