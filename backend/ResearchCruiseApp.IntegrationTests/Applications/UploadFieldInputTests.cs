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
using static ResearchCruiseApp.IntegrationTests.Infrastructure.FormRequests;

namespace ResearchCruiseApp.IntegrationTests.Applications;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class UploadFieldInputTests(SqlFixture fixture) : IAsyncLifetime
{
    private const string OwnerEmail = "upload-owner@example.invalid";
    private const string Pdf = "JVBERi0xLjQKJSVFT0Y=";
    private const string Png = "iVBORw0KGgo=";

    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    [Theory]
    [InlineData(0)]
    [InlineData(1)]
    [InlineData(2)]
    [InlineData(3)]
    [InlineData(4)]
    [InlineData(5)]
    public async Task Write_WhenUploadStringIsNullOrMissing_RejectsAndPreservesStoredFiles(
        int target
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
        foreach (var property in new[] { "Name", "Content" })
        foreach (var omitted in new[] { false, true })
        {
            var fields = (JsonObject)prepared.Fields.DeepClone();
            var file = Upload(fields, target);
            if (omitted)
                file.Remove(property);
            else
                file[property] = null;
            using var response = await Write(client, prepared.Route, fields, true, target == 0);
            Assert.True(
                response.StatusCode == HttpStatusCode.BadRequest,
                $"Target={target}, {property}, omitted={omitted}: {(int)response.StatusCode}"
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
            // Only the valid control may create a row after every rejected creation attempt.
            using var saved = await Write(client, prepared.Route, prepared.Fields, true, true);
            Assert.Equal(HttpStatusCode.Created, saved.StatusCode);
            Guid id = default;
            await app.InDatabase(async db => id = (await db.CruiseApplications.SingleAsync(ct)).Id);
            await AssertUpload(app, client, $"/v2/applications/{id}/form-a", target);
        }
    }

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
}
