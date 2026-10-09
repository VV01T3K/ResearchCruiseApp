using System.IO.Compression;
using System.Net;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Applications;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class ContractScanHttpTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public async Task Write_WhenContractScanIsInvalid_PreservesDraftAndOriginalFiles(bool draft)
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var form = await CompleteForm(app);
        using var client = await TestApplications.Login(app, "owner@example.invalid");
        var original = new FileContent { Name = "original.txt", Content = Content(20, false) };
        form.Contracts.Add(Contract(original));
        var id = await CreateDraft(app, client, form);
        var route = $"/v2/applications/{id}/form-a";
        var identities = await AssertFiles(app, client, id, [original], false);
        Guid originalForm = default;
        await app.InDatabase(async db => originalForm = (await db.FormsA.SingleAsync(ct)).Id);
        FileContent[] invalid =
        [
            new() { Name = "too-large.bin", Content = Content(2_097_153, false) },
            new() { Name = "too-large.bin", Content = Content(2_097_153, true) },
            new() { Name = "broken.bin", Content = "not base64!" },
            new() { Name = "broken.bin", Content = "data:application/pdf;base64,%%%" },
            new() { Name = "", Content = Content(20, false) },
        ];
        foreach (var scan in invalid)
        {
            form.Contracts[0].Scans.Clear();
            form.Contracts[0].Scans.Add(scan);
            using var response = await Write(client, route, form, draft);
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
                    .GetProperty("form.contracts[0]")
                    .EnumerateArray()
            );
            var persisted = await AssertFiles(app, client, id, [original], false);
            Assert.Equal(identities.Contract, persisted.Contract);
            Assert.Equal(identities.Files, persisted.Files);
            await app.InDatabase(async db =>
                Assert.Equal(originalForm, (await db.FormsA.SingleAsync(ct)).Id)
            );
        }
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public async Task Scan_WhenAtSizeBoundary_RoundTripsReplacementAndFinalSubmission(bool dataUri)
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var form = await CompleteForm(app);
        using var client = await TestApplications.Login(app, "owner@example.invalid");
        var first = new FileContent
        {
            Name = "contract-2097151.bin",
            Content = Content(2_097_151, dataUri),
        };
        form.Contracts.Add(Contract(first));
        var id = await CreateDraft(app, client, form);
        var route = $"/v2/applications/{id}/form-a";
        var initial = await AssertFiles(app, client, id, [first], false);
        var second = new FileContent
        {
            Name = "contract-2097152.bin",
            Content = Content(2_097_152, dataUri),
        };
        form.Contracts[0].Scans.Clear();
        form.Contracts[0].Scans.Add(second);
        // Empty upload controls are accepted but never create a ContractFile row.
        form.Contracts[0].Scans.Add(new FileContent { Name = "", Content = "" });
        using var replaced = await Write(client, route, form, true);
        Assert.Equal(HttpStatusCode.NoContent, replaced.StatusCode);
        var replacement = await AssertFiles(app, client, id, [second], false);
        Assert.NotEqual(initial.Contract, replacement.Contract);
        Assert.NotEqual(initial.Files[0], replacement.Files[0]);
        using var anonymous = app.CreateApiClient();
        var other = await TestUsers.Create(app, "other@example.invalid", RoleName.CruiseManager);
        using var unrelated = await TestApplications.Login(app, other.Email!);
        var admin = await TestUsers.Create(app, "admin@example.invalid", RoleName.Administrator);
        using var administrator = await TestApplications.Login(app, admin.Email!);
        foreach (
            var (actor, expected) in new[]
            {
                (anonymous, HttpStatusCode.Unauthorized),
                (unrelated, HttpStatusCode.NotFound),
                (administrator, HttpStatusCode.NotFound),
            }
        )
        {
            using var deniedRead = await actor.GetAsync(route, ct);
            Assert.Equal(expected, deniedRead.StatusCode);
            using var deniedWrite = await Write(actor, route, form, true);
            Assert.Equal(expected, deniedWrite.StatusCode);
        }
        var unchanged = await AssertFiles(app, client, id, [second], false);
        Assert.Equal(replacement.Contract, unchanged.Contract);
        Assert.Equal(replacement.Files, unchanged.Files);
        using var submitted = await Write(client, route, form, false);
        Assert.Equal(HttpStatusCode.NoContent, submitted.StatusCode);
        var final = await AssertFiles(app, client, id, [second], true);
        Assert.Equal(replacement.Contract, final.Contract);
        Assert.Equal(replacement.Files, final.Files);
        await app.Dispatch(ct);
        Assert.Equal(
            "supervisor@example.invalid",
            Assert.Single(app.Transport.Messages).Payload.Recipient
        );
    }

    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public async Task Write_WhenFormAContainsPermissionScan_RejectsWithoutMutation(bool draft)
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var form = await CompleteForm(app);
        using var client = await TestApplications.Login(app, "owner@example.invalid");
        var permission = new PermissionFields { Description = "Sampling", Executive = "Authority" };
        form.Permissions.Add(permission);
        var id = await CreateDraft(app, client, form);
        Guid permissionId = default;
        Guid formId = default;
        await app.InDatabase(async db =>
        {
            permissionId = (await db.Permissions.SingleAsync(ct)).Id;
            formId = (await db.FormsA.SingleAsync(ct)).Id;
        });
        foreach (
            var scan in new[]
            {
                new FileContent { Name = "permission.pdf", Content = "JVBERi0xLjQKJSVFT0Y=" },
                new FileContent { Name = "", Content = "" },
            }
        )
        {
            permission.Scan = scan;
            using var rejected = await Write(client, $"/v2/applications/{id}/form-a", form, draft);
            Assert.Equal(HttpStatusCode.BadRequest, rejected.StatusCode);
            using var problem = await JsonDocument.ParseAsync(
                await rejected.Content.ReadAsStreamAsync(ct),
                cancellationToken: ct
            );
            Assert.NotEmpty(
                problem
                    .RootElement.GetProperty("errors")
                    .GetProperty("form.permissions[0]")
                    .EnumerateArray()
            );
            var read = await client.GetFromJsonAsync<FormAFields>(
                $"/v2/applications/{id}/form-a",
                ct
            );
            Assert.Null(Assert.Single(read!.Permissions).Scan);
            await app.InDatabase(async db =>
            {
                var stored = await db.Permissions.SingleAsync(ct);
                Assert.Equal(permissionId, stored.Id);
                Assert.Null(stored.ScanName);
                Assert.Null(stored.ScanContent);
                Assert.Equal(formId, (await db.FormsA.SingleAsync(ct)).Id);
                Assert.Equal(
                    CruiseApplicationStatus.Draft,
                    (await db.CruiseApplications.SingleAsync(ct)).Status
                );
                Assert.Empty(await db.Set<ContractFile>().ToListAsync(ct));
                Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
            });
        }
        Assert.Empty(app.Transport.Messages);
    }

    [Fact]
    public async Task Remove_WhenContractIsShared_DeletesFilesOnlyAfterFinalReference()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var form = await CompleteForm(app);
        using var client = await TestApplications.Login(app, "owner@example.invalid");
        FileContent[] files =
        [
            new() { Name = "first.txt", Content = Convert.ToBase64String("first"u8) },
            new() { Name = "second.txt", Content = Convert.ToBase64String("second"u8) },
        ];
        form.Contracts.Add(Contract(files));
        var first = await CreateDraft(app, client, form);
        form.Contracts[0].Scans.Reverse();
        var second = await CreateDraft(app, client, form);
        Guid contractId = default;
        Guid[] fileIds = [];
        await app.InDatabase(async db =>
        {
            contractId = (await db.Contracts.SingleAsync(ct)).Id;
            fileIds = await db.Set<ContractFile>()
                .OrderBy(row => row.Id)
                .Select(row => row.Id)
                .ToArrayAsync(ct);
            Assert.Equal(2, fileIds.Length);
            Assert.Equal(2, await db.Set<FormAContract>().CountAsync(ct));
        });
        form.Contracts.Clear();
        using var removedFirst = await Write(
            client,
            $"/v2/applications/{first}/form-a",
            form,
            true
        );
        Assert.Equal(HttpStatusCode.NoContent, removedFirst.StatusCode);
        var retained = await AssertFiles(app, client, second, files, false);
        Assert.Equal(contractId, retained.Contract);
        Assert.Equal(fileIds.Order(), retained.Files);
        var firstRead = await client.GetFromJsonAsync<FormAFields>(
            $"/v2/applications/{first}/form-a",
            ct
        );
        Assert.Empty(firstRead!.Contracts);
        using var removedSecond = await Write(
            client,
            $"/v2/applications/{second}/form-a",
            form,
            true
        );
        Assert.Equal(HttpStatusCode.NoContent, removedSecond.StatusCode);
        var secondRead = await client.GetFromJsonAsync<FormAFields>(
            $"/v2/applications/{second}/form-a",
            ct
        );
        Assert.Empty(secondRead!.Contracts);
        await app.InDatabase(async db =>
        {
            Assert.Empty(await db.Contracts.ToListAsync(ct));
            Assert.Empty(await db.Set<FormAContract>().ToListAsync(ct));
            Assert.Empty(await db.Set<ContractFile>().ToListAsync(ct));
            Assert.Equal(2, await db.FormsA.CountAsync(ct));
            Assert.All(
                await db.CruiseApplications.ToListAsync(ct),
                row => Assert.Equal(CruiseApplicationStatus.Draft, row.Status)
            );
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        Assert.Empty(app.Transport.Messages);
    }

    private static ContractFields Contract(params FileContent[] scans) =>
        new()
        {
            Category = ContractCategory.Domestic,
            InstitutionName = "Synthetic institution",
            InstitutionUnit = "Synthetic unit",
            InstitutionLocalization = "Synthetic location",
            Description = "Synthetic cooperation",
            Scans = scans.ToList(),
        };

    private static string Content(int size, bool dataUri)
    {
        var bytes = new byte[size];
        Array.Fill(bytes, (byte)'a');
        var content = Convert.ToBase64String(bytes);
        return dataUri ? "data:application/octet-stream;base64," + content : content;
    }

    private static async Task<FormAFields> CompleteForm(TestApplication app)
    {
        var owner = await TestUsers.Create(app, "owner@example.invalid", RoleName.CruiseManager);
        var deputy = await TestUsers.Create(app, "deputy@example.invalid", RoleName.CruiseManager);
        var unit = new UgUnit { Name = "Contract faculty", IsActive = true };
        await app.InDatabase(async db =>
        {
            db.UgUnits.Add(unit);
            await db.SaveChangesAsync(TestContext.Current.CancellationToken);
        });
        return FormAWorkflowTests.CompleteForm(
            Guid.Parse(owner.Id),
            Guid.Parse(deputy.Id),
            unit.Id
        );
    }

    private static async Task<Guid> CreateDraft(
        TestApplication app,
        HttpClient client,
        FormAFields form
    )
    {
        var ct = TestContext.Current.CancellationToken;
        var existing = new HashSet<Guid>();
        await app.InDatabase(async db =>
            existing.UnionWith(await db.CruiseApplications.Select(row => row.Id).ToListAsync(ct))
        );
        using var created = await client.PostAsJsonAsync(
            "/v2/applications",
            new FormAWriteRequest { Form = form, Draft = true },
            ct
        );
        Assert.Equal(HttpStatusCode.Created, created.StatusCode);
        Guid id = default;
        await app.InDatabase(async db =>
            id = Assert.Single(
                (await db.CruiseApplications.Select(row => row.Id).ToListAsync(ct)).Except(existing)
            )
        );
        return id;
    }

    private static Task<HttpResponseMessage> Write(
        HttpClient client,
        string route,
        FormAFields form,
        bool draft
    ) =>
        client.PutAsJsonAsync(
            route,
            new FormAWriteRequest { Form = form, Draft = draft },
            TestContext.Current.CancellationToken
        );

    private static async Task<(Guid Contract, Guid[] Files)> AssertFiles(
        TestApplication app,
        HttpClient client,
        Guid id,
        FileContent[] expected,
        bool final
    )
    {
        var ct = TestContext.Current.CancellationToken;
        var read = await client.GetFromJsonAsync<FormAFields>($"/v2/applications/{id}/form-a", ct);
        var contract = Assert.Single(read!.Contracts);
        Assert.Equal(expected.Length, contract.Scans.Count);
        foreach (var scan in expected)
            Assert.Equal(
                scan.Content,
                Assert.Single(contract.Scans, file => file.Name == scan.Name).Content
            );
        Guid contractId = default;
        Guid[] fileIds = [];
        await app.InDatabase(async db =>
        {
            var stored = await db.Contracts.Include(row => row.Files).SingleAsync(ct);
            contractId = stored.Id;
            fileIds = stored.Files.Select(row => row.Id).Order().ToArray();
            Assert.Equal(expected.Length, stored.Files.Count);
            Assert.Equal(expected.Length, await db.Set<ContractFile>().CountAsync(ct));
            foreach (var scan in expected)
            {
                var file = Assert.Single(stored.Files, file => file.FileName == scan.Name);
                Assert.NotNull(file.FileContent);
                Assert.Equal(stored.Id, file.ContractId);
                Assert.False(file.FileContent.SequenceEqual(Encoding.UTF8.GetBytes(scan.Content)));
                using var input = new MemoryStream(file.FileContent);
                await using var gzip = new GZipStream(input, CompressionMode.Decompress);
                using var reader = new StreamReader(gzip, Encoding.UTF8);
                Assert.Equal(scan.Content, await reader.ReadToEndAsync(ct));
            }
            Assert.Equal(
                final
                    ? CruiseApplicationStatus.WaitingForSupervisor
                    : CruiseApplicationStatus.Draft,
                (await db.CruiseApplications.SingleAsync(row => row.Id == id, ct)).Status
            );
            Assert.Equal(final ? 1 : 0, await db.EmailOutboxMessages.CountAsync(ct));
        });
        Assert.Empty(app.Transport.Messages);
        return (contractId, fileIds);
    }
}
