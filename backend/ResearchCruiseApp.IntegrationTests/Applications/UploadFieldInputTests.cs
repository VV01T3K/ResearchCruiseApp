using System.IO.Compression;
using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Applications;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class UploadFieldInputTests(SqlFixture fixture) : IAsyncLifetime
{
    private const string OwnerEmail = "upload-owner@example.invalid";
    private const string Pdf = "JVBERi0xLjQKJSVFT0Y=";
    private const string Png = "iVBORw0KGgo=";

    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    // BE-FILE-009: shared non-null upload fields reject before factory/scoring/file changes.
    [Theory]
    [InlineData(0, true, true)]
    [InlineData(0, true, false)]
    [InlineData(0, false, true)]
    [InlineData(0, false, false)]
    [InlineData(1, true, true)]
    [InlineData(1, true, false)]
    [InlineData(1, false, true)]
    [InlineData(1, false, false)]
    [InlineData(2, true, true)]
    [InlineData(2, true, false)]
    [InlineData(2, false, true)]
    [InlineData(2, false, false)]
    [InlineData(3, true, true)]
    [InlineData(3, true, false)]
    [InlineData(3, false, true)]
    [InlineData(3, false, false)]
    [InlineData(4, true, true)]
    [InlineData(4, true, false)]
    [InlineData(4, false, true)]
    [InlineData(4, false, false)]
    [InlineData(5, true, true)]
    [InlineData(5, true, false)]
    [InlineData(5, false, true)]
    [InlineData(5, false, false)]
    public async Task Write_WhenUploadStringIsNullOrMissing_RejectsAndPreservesStoredFiles(
        int target,
        bool draft,
        bool name
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var prepared = await Prepare(app, target);
        using var client = prepared.Client;
        var original = await Snapshot(app);
        var originalHttp = target == 0 ? null : await Read(client, prepared.Route);
        if (target != 0)
            await AssertUpload(app, client, prepared.Route, target);
        var property = name ? "Name" : "Content";
        foreach (var omitted in new[] { false, true })
        {
            var fields = (JsonObject)prepared.Fields.DeepClone();
            var file = Upload(fields, target);
            if (omitted)
                file.Remove(property);
            else
                file[property] = null;
            using var response = await Write(client, prepared.Route, fields, draft, target == 0);
            Assert.True(
                response.StatusCode == HttpStatusCode.BadRequest,
                $"Target={target}, draft={draft}, {property}, omitted={omitted}: {(int)response.StatusCode}"
            );
            Assert.Equal(
                "application/problem+json",
                response.Content.Headers.ContentType?.MediaType
            );
            using var problem = await JsonDocument.ParseAsync(
                await response.Content.ReadAsStreamAsync(ct),
                cancellationToken: ct
            );
            var path =
                target <= 2 ? "form.contracts[0].scans[0]"
                : target <= 4 ? "form.permissions[0].scan"
                : "form.photos[0]";
            Assert.NotEmpty(
                problem
                    .RootElement.GetProperty("errors")
                    .GetProperty($"{path}.{JsonNamingPolicy.CamelCase.ConvertName(property)}")
                    .EnumerateArray()
            );
            Assert.Equal(original, await Snapshot(app));
            if (target != 0)
                Assert.Equal(originalHttp, await Read(client, prepared.Route));
        }
        await app.Dispatch(ct);
        Assert.Empty(app.Transport.Messages);
        if (target == 0)
        {
            // Only the valid control may create a row after both rejected creation attempts.
            using var saved = await Write(client, prepared.Route, prepared.Fields, true, true);
            Assert.Equal(HttpStatusCode.Created, saved.StatusCode);
            Guid id = default;
            await app.InDatabase(async db => id = (await db.CruiseApplications.SingleAsync(ct)).Id);
            await AssertUpload(app, client, $"/v2/applications/{id}/form-a", target);
        }
    }

    // BE-FILE-010: reject the first unsupported length; preserve the exact supported boundary.
    [Theory]
    [InlineData(0)]
    [InlineData(1)]
    [InlineData(2)]
    [InlineData(3)]
    [InlineData(4)]
    [InlineData(5)]
    public async Task Write_WhenUploadNameExceedsDeclaredLimit_RejectsButBoundaryRoundTrips(
        int target
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var prepared = await Prepare(app, target);
        using var client = prepared.Client;
        var original = await Snapshot(app);
        var originalHttp = target == 0 ? null : await Read(client, prepared.Route);
        var fields = (JsonObject)prepared.Fields.DeepClone();
        Upload(fields, target)["Name"] = new string('n', 1025);
        foreach (var draft in new[] { true, false })
        {
            using var response = await Write(client, prepared.Route, fields, draft, target == 0);
            Assert.True(
                response.StatusCode == HttpStatusCode.BadRequest,
                $"Target={target}, draft={draft}, oversized name: {(int)response.StatusCode}"
            );
            Assert.Equal(
                "application/problem+json",
                response.Content.Headers.ContentType?.MediaType
            );
            using var problem = await JsonDocument.ParseAsync(
                await response.Content.ReadAsStreamAsync(ct),
                cancellationToken: ct
            );
            var path =
                target <= 2 ? "form.contracts[0].scans[0]"
                : target <= 4 ? "form.permissions[0].scan"
                : "form.photos[0]";
            Assert.NotEmpty(
                problem
                    .RootElement.GetProperty("errors")
                    .GetProperty($"{path}.name")
                    .EnumerateArray()
            );
            Assert.Equal(original, await Snapshot(app));
            if (target != 0)
                Assert.Equal(originalHttp, await Read(client, prepared.Route));
        }
        var boundary = new string('n', 1024);
        Upload(fields, target)["Name"] = boundary;
        using var saved = await Write(client, prepared.Route, fields, true, target == 0);
        Assert.Equal(
            target == 1 ? HttpStatusCode.NoContent : HttpStatusCode.Created,
            saved.StatusCode
        );
        var route = prepared.Route;
        if (target == 0)
        {
            Guid id = default;
            await app.InDatabase(async db => id = (await db.CruiseApplications.SingleAsync(ct)).Id);
            route = $"/v2/applications/{id}/form-a";
        }
        await AssertUpload(app, client, route, target, boundary);
        await app.Dispatch(ct);
        Assert.Empty(app.Transport.Messages);
    }

    private static async Task<(HttpClient Client, JsonObject Fields, string Route)> Prepare(
        TestApplication app,
        int target
    )
    {
        var ct = TestContext.Current.CancellationToken;
        Guid id = default;
        JsonObject fields;
        if (target <= 1)
        {
            var owner = await TestUsers.Create(app, OwnerEmail, RoleName.CruiseManager);
            var deputy = await TestUsers.Create(
                app,
                "upload-deputy@example.invalid",
                RoleName.CruiseManager
            );
            var unit = new UgUnit { Name = "Upload faculty", IsActive = true };
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
            fields["Note"] = "Original upload draft";
        }
        else
        {
            var application = await TestApplications.Create(
                app,
                target == 3
                    ? CruiseApplicationStatus.FormBRequired
                    : CruiseApplicationStatus.Undertaken,
                OwnerEmail
            );
            id = application.Id;
            fields =
                target == 3
                    ? new JsonObject { ["IsCruiseManagerPresent"] = "true" }
                    : new JsonObject { ["ShipUsage"] = "0", ["DifferentUsage"] = "" };
        }
        var file = new JsonObject
        {
            ["Name"] = target == 5 ? "original.png" : "original.pdf",
            ["Content"] = target == 5 ? Png : Pdf,
        };
        if (target <= 2)
            fields["Contracts"] = new JsonArray(
                new JsonObject
                {
                    ["Category"] = ContractCategory.Domestic,
                    ["InstitutionName"] = "Synthetic institution",
                    ["InstitutionUnit"] = "Synthetic unit",
                    ["InstitutionLocalization"] = "Synthetic location",
                    ["Description"] = "Original agreement",
                    ["Scans"] = new JsonArray(file),
                }
            );
        else if (target <= 4)
            fields["Permissions"] = new JsonArray(
                new JsonObject
                {
                    ["Description"] = "Original sampling approval",
                    ["Executive"] = "Synthetic authority",
                    ["Scan"] = file,
                }
            );
        else
            fields["Photos"] = new JsonArray(file);
        var client = await TestApplications.Login(app, OwnerEmail);
        try
        {
            if (target == 1)
            {
                using var saved = await Write(client, "/v2/applications", fields, true, true);
                Assert.Equal(HttpStatusCode.Created, saved.StatusCode);
                await app.InDatabase(async db =>
                    id = (await db.CruiseApplications.SingleAsync(ct)).Id
                );
            }
            var route =
                target == 0
                    ? "/v2/applications"
                    : $"/v2/applications/{id}/form-{(target == 1 ? "a" : target == 3 ? "b" : "c")}";
            if (target >= 2)
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

    private static JsonObject Upload(JsonObject fields, int target) =>
        (
            target <= 2 ? fields["Contracts"]![0]!["Scans"]![0]!
            : target <= 4 ? fields["Permissions"]![0]!["Scan"]!
            : fields["Photos"]![0]!
        ).AsObject();

    private static Task<HttpResponseMessage> Write(
        HttpClient client,
        string route,
        JsonObject fields,
        bool draft,
        bool create
    ) =>
        create
            ? client.PostAsJsonAsync(
                route,
                new { Form = fields, Draft = draft },
                TestContext.Current.CancellationToken
            )
            : client.PutAsJsonAsync(
                route,
                new { Form = fields, Draft = draft },
                TestContext.Current.CancellationToken
            );

    private static async Task<string> Read(HttpClient client, string route)
    {
        using var response = await client.GetAsync(route, TestContext.Current.CancellationToken);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        return await response.Content.ReadAsStringAsync(TestContext.Current.CancellationToken);
    }

    private static async Task AssertUpload(
        TestApplication app,
        HttpClient client,
        string route,
        int target,
        string? expectedName = null
    )
    {
        var ct = TestContext.Current.CancellationToken;
        using var body = JsonDocument.Parse(await Read(client, route));
        var root = body.RootElement;
        var file =
            target <= 2
                ? Assert.Single(
                    Assert
                        .Single(root.GetProperty("contracts").EnumerateArray())
                        .GetProperty("scans")
                        .EnumerateArray()
                )
            : target <= 4
                ? Assert
                    .Single(root.GetProperty("permissions").EnumerateArray())
                    .GetProperty("scan")
            : Assert.Single(root.GetProperty("photos").EnumerateArray());
        var expected = target == 5 ? Png : Pdf;
        Assert.Equal(
            expectedName ?? (target == 5 ? "original.png" : "original.pdf"),
            file.GetProperty("name").GetString()
        );
        Assert.Equal(expected, file.GetProperty("content").GetString());
        byte[] compressed = [];
        await app.InDatabase(async db =>
        {
            compressed =
                target <= 2 ? (await db.ContractFiles.SingleAsync(ct)).FileContent!
                : target <= 4 ? (await db.Permissions.SingleAsync(ct)).ScanContent!
                : (await db.Photos.SingleAsync(ct)).Content;
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        using var stored = new MemoryStream(compressed);
        using var gzip = new GZipStream(stored, CompressionMode.Decompress);
        using var reader = new StreamReader(gzip);
        Assert.Equal(expected, await reader.ReadToEndAsync(ct));
        Assert.Empty(app.Transport.Messages);
    }

    private static async Task<string> Snapshot(TestApplication app)
    {
        var ct = TestContext.Current.CancellationToken;
        string snapshot = "";
        await app.InDatabase(async db =>
            snapshot = JsonSerializer.Serialize(
                new
                {
                    Applications = await db
                        .CruiseApplications.OrderBy(row => row.Id)
                        .Select(row => new
                        {
                            row.Id,
                            row.Note,
                            row.Status,
                            row.Number,
                            row.EffectsPoints,
                            row.SupervisorCode,
                        })
                        .ToArrayAsync(ct),
                    FormsA = await db
                        .FormsA.OrderBy(row => row.Id)
                        .Select(row => row.Id)
                        .ToArrayAsync(ct),
                    FormsB = await db
                        .FormsB.OrderBy(row => row.Id)
                        .Select(row => row.Id)
                        .ToArrayAsync(ct),
                    FormsC = await db
                        .FormsC.OrderBy(row => row.Id)
                        .Select(row => row.Id)
                        .ToArrayAsync(ct),
                    Contracts = await db
                        .Contracts.OrderBy(row => row.Id)
                        .Select(row => row.Id)
                        .ToArrayAsync(ct),
                    Files = await db
                        .ContractFiles.OrderBy(row => row.Id)
                        .Select(row => new
                        {
                            row.Id,
                            row.FileName,
                            row.FileContent,
                        })
                        .ToArrayAsync(ct),
                    Permissions = await db
                        .Permissions.OrderBy(row => row.Id)
                        .Select(row => new
                        {
                            row.Id,
                            row.Description,
                            row.Executive,
                            row.ScanName,
                            row.ScanContent,
                        })
                        .ToArrayAsync(ct),
                    Photos = await db
                        .Photos.OrderBy(row => row.Id)
                        .Select(row => new
                        {
                            row.Id,
                            row.Name,
                            row.Content,
                        })
                        .ToArrayAsync(ct),
                    Areas = await db
                        .ResearchAreaDescriptions.OrderBy(row => row.Id)
                        .Select(row => row.Id)
                        .ToArrayAsync(ct),
                    Tasks = await db
                        .FormAResearchTasks.OrderBy(row => row.Id)
                        .Select(row => new { row.Id, row.Points })
                        .ToArrayAsync(ct),
                    Units = await db
                        .FormAUgUnits.OrderBy(row => row.Id)
                        .Select(row => row.Id)
                        .ToArrayAsync(ct),
                    Effects = await db
                        .UserEffects.OrderBy(row => row.Id)
                        .Select(row => row.Id)
                        .ToArrayAsync(ct),
                    Outbox = await db
                        .EmailOutboxMessages.OrderBy(row => row.Id)
                        .Select(row => row.Id)
                        .ToArrayAsync(ct),
                }
            )
        );
        return snapshot;
    }
}
