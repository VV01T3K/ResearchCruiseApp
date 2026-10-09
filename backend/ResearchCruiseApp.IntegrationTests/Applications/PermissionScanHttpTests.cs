using System.IO.Compression;
using System.Net;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Applications;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class PermissionScanHttpTests(SqlFixture fixture) : IAsyncLifetime
{
    private const string SmallPdf = "JVBERi0xLjQKJSVFT0Y=";

    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    // BE-FILE-003: rejected final scans preserve the existing compressed scan and form.
    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public async Task Submit_WhenPermissionScanIsInvalid_PreservesOriginalFileAndForm(bool formC)
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var status = formC
            ? CruiseApplicationStatus.Undertaken
            : CruiseApplicationStatus.FormBRequired;
        var application = await TestApplications.Create(app, status);
        using var client = await TestApplications.Login(app, application.OwnerEmail);
        var route = $"/v2/applications/{application.Id}/form-{(formC ? "c" : "b")}";
        var permissions = new List<PermissionFields> { Permission("original.pdf", SmallPdf) };
        using var saved = await Write(client, route, formC, permissions, true);
        Assert.Equal(HttpStatusCode.Created, saved.StatusCode);
        var originalPermission = await AssertFile(
            app,
            client,
            route,
            formC,
            status,
            "original.pdf",
            SmallPdf
        );
        Guid originalForm = default;
        await app.InDatabase(async db =>
            originalForm = formC
                ? (await db.FormsC.SingleAsync(ct)).Id
                : (await db.FormsB.SingleAsync(ct)).Id
        );
        string[] invalid =
        [
            Pdf(2_097_153, false),
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a1xkAAAAASUVORK5CYII=",
            Convert.ToBase64String("plain text"u8),
            "not base64!",
            "",
            Convert.ToBase64String("%PD"u8),
        ];
        foreach (var content in invalid)
        {
            permissions[0] = Permission("replacement.pdf", content);
            using var response = await Write(client, route, formC, permissions, false);
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
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
                    .GetProperty("form.permissions[0]")
                    .EnumerateArray()
            );
            Assert.Equal(
                originalPermission,
                await AssertFile(app, client, route, formC, status, "original.pdf", SmallPdf)
            );
            await app.InDatabase(async db =>
                Assert.Equal(
                    originalForm,
                    formC
                        ? (await db.FormsC.SingleAsync(ct)).Id
                        : (await db.FormsB.SingleAsync(ct)).Id
                )
            );
        }
    }

    // BE-FILE-004: exact decoded size, persisted compression, access and final-reference cleanup.
    [Theory]
    [InlineData(false, false)]
    [InlineData(false, true)]
    [InlineData(true, false)]
    [InlineData(true, true)]
    public async Task Scan_WhenAtSizeBoundary_RoundTripsAndCanBeReplacedThenRemoved(
        bool formC,
        bool dataUri
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var status = formC
            ? CruiseApplicationStatus.Undertaken
            : CruiseApplicationStatus.FormBRequired;
        var application = await TestApplications.Create(app, status);
        var office = await TestUsers.Create(app, "office@example.invalid", RoleName.Shipowner);
        var other = await TestUsers.Create(app, "other@example.invalid", RoleName.CruiseManager);
        using var client = await TestApplications.Login(app, application.OwnerEmail);
        var route = $"/v2/applications/{application.Id}/form-{(formC ? "c" : "b")}";
        var permissions = new List<PermissionFields>();
        Guid previousPermission = default;
        string lastName = "";
        string lastContent = "";
        foreach (var size in new[] { 2_097_151, 2_097_152 })
        {
            lastName = $"permission-{size}.pdf";
            lastContent = Pdf(size, dataUri);
            permissions.Clear();
            permissions.Add(Permission(lastName, lastContent));
            using var saved = await Write(client, route, formC, permissions, true);
            Assert.Equal(HttpStatusCode.Created, saved.StatusCode);
            var current = await AssertFile(
                app,
                client,
                route,
                formC,
                status,
                lastName,
                lastContent
            );
            Assert.NotEqual(previousPermission, current);
            previousPermission = current;
        }
        using var submitted = await Write(client, route, formC, permissions, false);
        Assert.Equal(HttpStatusCode.Created, submitted.StatusCode);
        var finalStatus = formC
            ? CruiseApplicationStatus.Reported
            : CruiseApplicationStatus.FormBFilled;
        Assert.Equal(
            previousPermission,
            await AssertFile(app, client, route, formC, finalStatus, lastName, lastContent)
        );
        using var anonymous = app.CreateApiClient();
        using var otherClient = await TestApplications.Login(app, other.Email!);
        using var anonymousRead = await anonymous.GetAsync(route, ct);
        Assert.Equal(HttpStatusCode.Unauthorized, anonymousRead.StatusCode);
        using var anonymousWrite = await Write(anonymous, route, formC, [], true);
        Assert.Equal(HttpStatusCode.Unauthorized, anonymousWrite.StatusCode);
        using var otherRead = await otherClient.GetAsync(route, ct);
        Assert.Equal(HttpStatusCode.NotFound, otherRead.StatusCode);
        using var otherWrite = await Write(otherClient, route, formC, [], true);
        Assert.Equal(HttpStatusCode.NotFound, otherWrite.StatusCode);
        Assert.Equal(
            previousPermission,
            await AssertFile(app, client, route, formC, finalStatus, lastName, lastContent)
        );
        using var officeClient = await TestApplications.Login(app, office.Email!);
        using var refill = await officeClient.PutAsync(route + "/refill", null, ct);
        Assert.Equal(HttpStatusCode.NoContent, refill.StatusCode);
        permissions.Clear();
        using var removed = await Write(client, route, formC, permissions, true);
        Assert.Equal(HttpStatusCode.Created, removed.StatusCode);
        Assert.Empty(await ReadPermissions(client, route, formC));
        await app.InDatabase(async db =>
        {
            Assert.Empty(await db.Permissions.ToListAsync(ct));
            Assert.Equal(status, (await db.CruiseApplications.SingleAsync(ct)).Status);
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        Assert.Empty(app.Transport.Messages);
    }

    private static PermissionFields Permission(string name, string content) =>
        new()
        {
            Description = "Synthetic permission",
            Executive = "Synthetic authority",
            Scan = new FileContent { Name = name, Content = content },
        };

    private static string Pdf(int size, bool dataUri)
    {
        var bytes = new byte[size];
        Array.Fill(bytes, (byte)'a');
        "%PDF-1.4\n"u8.CopyTo(bytes);
        "\n%%EOF"u8.CopyTo(bytes.AsSpan(size - 6));
        var content = Convert.ToBase64String(bytes);
        return dataUri ? "data:application/pdf;base64," + content : content;
    }

    private static Task<HttpResponseMessage> Write(
        HttpClient client,
        string route,
        bool formC,
        List<PermissionFields> permissions,
        bool draft
    ) =>
        formC
            ? client.PutAsJsonAsync(
                route,
                new FormCWriteRequest
                {
                    Form = new FormCFields
                    {
                        ShipUsage = "0",
                        DifferentUsage = "",
                        Permissions = permissions,
                    },
                    Draft = draft,
                },
                TestContext.Current.CancellationToken
            )
            : client.PutAsJsonAsync(
                route,
                new FormBWriteRequest
                {
                    Form = new FormBFields
                    {
                        IsCruiseManagerPresent = "true",
                        Permissions = permissions,
                    },
                    Draft = draft,
                },
                TestContext.Current.CancellationToken
            );

    private static async Task<List<PermissionFields>> ReadPermissions(
        HttpClient client,
        string route,
        bool formC
    )
    {
        var ct = TestContext.Current.CancellationToken;
        using var response = await client.GetAsync(route, ct);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        return formC
            ? (await response.Content.ReadFromJsonAsync<FormCFields>(ct))!.Permissions
            : (await response.Content.ReadFromJsonAsync<FormBFields>(ct))!.Permissions;
    }

    private static async Task<Guid> AssertFile(
        TestApplication app,
        HttpClient client,
        string route,
        bool formC,
        CruiseApplicationStatus status,
        string name,
        string content
    )
    {
        var ct = TestContext.Current.CancellationToken;
        var permission = Assert.Single(await ReadPermissions(client, route, formC));
        Assert.Equal(name, permission.Scan!.Name);
        Assert.Equal(content, permission.Scan.Content);
        Guid id = default;
        await app.InDatabase(async db =>
        {
            var stored = Assert.Single(await db.Permissions.ToListAsync(ct));
            id = stored.Id;
            Assert.Equal(name, stored.ScanName);
            Assert.NotNull(stored.ScanContent);
            Assert.False(stored.ScanContent.SequenceEqual(Encoding.UTF8.GetBytes(content)));
            using var input = new MemoryStream(stored.ScanContent);
            await using var gzip = new GZipStream(input, CompressionMode.Decompress);
            using var reader = new StreamReader(gzip, Encoding.UTF8);
            Assert.Equal(content, await reader.ReadToEndAsync(ct));
            Assert.Equal(status, (await db.CruiseApplications.SingleAsync(ct)).Status);
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        Assert.Empty(app.Transport.Messages);
        return id;
    }
}
