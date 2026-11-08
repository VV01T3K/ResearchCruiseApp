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
public sealed class ResearchAreaFileHttpTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    [Fact]
    public async Task Files_RoundTripReplaceRemoveAndSubmit()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var form = await CompleteForm(app);
        using var client = await TestApplications.Login(app, "owner@example.invalid");
        FileContent[] initial = [Pdf("map-north.pdf", 1000, 1), Pdf("map-south.pdf", 2000, 2)];
        form.ResearchAreaFiles.AddRange(initial);
        var id = await CreateDraft(app, client, form);
        var route = $"/v2/applications/{id}/form-a";
        await AssertFiles(app, client, id, initial);

        FileContent[] replaced =
        [
            initial[1],
            .. Enumerable.Range(3, 4).Select(seed => Pdf($"map-{seed}.pdf", 2_097_152, seed)),
        ];
        form.ResearchAreaFiles.Clear();
        form.ResearchAreaFiles.AddRange(replaced);
        using (var response = await Write(client, route, form, true))
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        await AssertFiles(app, client, id, replaced);

        form.ResearchAreaFiles.Clear();
        using (var response = await Write(client, route, form, true))
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        await AssertFiles(app, client, id, []);

        form.ResearchAreaFiles.Add(initial[0]);
        using (var response = await Write(client, route, form, false))
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        await AssertFiles(app, client, id, [initial[0]]);
        await app.InDatabase(async db =>
            Assert.Equal(
                CruiseApplicationStatus.WaitingForSupervisor,
                (await db.CruiseApplications.SingleAsync(ct)).Status
            )
        );
    }

    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public async Task Write_WhenFilesAreInvalid_RejectsWithoutChanges(bool draft)
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var form = await CompleteForm(app);
        using var client = await TestApplications.Login(app, "owner@example.invalid");
        var original = Pdf("original.pdf", 100, 1);
        form.ResearchAreaFiles.Add(original);
        var id = await CreateDraft(app, client, form);
        var route = $"/v2/applications/{id}/form-a";
        var snapshot = await FormRequests.Snapshot(app);
        var text = "data:text/plain;base64," + Convert.ToBase64String("not a pdf"u8);
        (FileContent[] Files, string Key)[] invalid =
        [
            ([new() { Name = "notes.txt", Content = text }], "form.researchAreaFiles[0]"),
            ([Pdf("too-large.pdf", 2_097_153, 2)], "form.researchAreaFiles[0]"),
            (
                [new() { Name = "broken.pdf", Content = "data:application/pdf;base64,%%%" }],
                "form.researchAreaFiles[0]"
            ),
            ([new() { Name = "", Content = original.Content }], "form.researchAreaFiles[0]"),
            (
                Enumerable.Range(0, 6).Select(seed => Pdf($"map-{seed}.pdf", 100, seed)).ToArray(),
                "form.researchAreaFiles"
            ),
        ];
        foreach (var (files, key) in invalid)
        {
            form.ResearchAreaFiles.Clear();
            form.ResearchAreaFiles.AddRange(files);
            using var response = await Write(client, route, form, draft);
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            using var problem = await JsonDocument.ParseAsync(
                await response.Content.ReadAsStreamAsync(ct),
                cancellationToken: ct
            );
            Assert.NotEmpty(
                problem.RootElement.GetProperty("errors").GetProperty(key).EnumerateArray()
            );
            Assert.Equal(snapshot, await FormRequests.Snapshot(app));
        }
        await AssertFiles(app, client, id, [original]);
    }

    [Fact]
    public async Task Write_WhenRevisionIsStale_LeavesFilesUnchanged()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var form = await CompleteForm(app);
        using var client = await TestApplications.Login(app, "owner@example.invalid");
        FileContent[] files = [Pdf("first.pdf", 100, 1), Pdf("second.pdf", 100, 2)];
        form.ResearchAreaFiles.AddRange(files);
        var id = await CreateDraft(app, client, form);
        var route = $"/v2/applications/{id}/form-a";
        var stale = await FormRequests.CurrentRevision(client, route);
        form.ResearchAreaFiles.RemoveAt(1);
        using (var saved = await Write(client, route, form, true))
            Assert.Equal(HttpStatusCode.OK, saved.StatusCode);
        var snapshot = await FormRequests.Snapshot(app);

        form.Revision = stale;
        form.ResearchAreaFiles.Clear();
        form.ResearchAreaFiles.Add(Pdf("third.pdf", 100, 3));
        using var rejected = await Write(client, route, form, true);
        Assert.Equal(HttpStatusCode.Conflict, rejected.StatusCode);
        Assert.Equal(snapshot, await FormRequests.Snapshot(app));
        form.Revision = null;
        await AssertFiles(app, client, id, [files[0]]);
    }

    private static (string, string)[] Pairs(IEnumerable<FileContent> files) =>
        files.Select(file => (file.Name, file.Content)).Order().ToArray();

    private static FileContent Pdf(string name, int size, int seed)
    {
        var bytes = new byte[size];
        new Random(seed).NextBytes(bytes);
        "%PDF-1.7\n"u8.CopyTo(bytes);
        return new FileContent
        {
            Name = name,
            Content = "data:application/pdf;base64," + Convert.ToBase64String(bytes),
        };
    }

    private static async Task<FormAFields> CompleteForm(TestApplication app)
    {
        var owner = await TestUsers.Create(app, "owner@example.invalid", RoleName.CruiseManager);
        var deputy = await TestUsers.Create(app, "deputy@example.invalid", RoleName.CruiseManager);
        var unit = new UgUnit { Name = "Map faculty", IsActive = true };
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
        using var created = await client.PostAsJsonAsync(
            "/v2/applications",
            new FormAWriteRequest { Form = form, Draft = true },
            ct
        );
        Assert.Equal(HttpStatusCode.Created, created.StatusCode);
        Guid id = default;
        await app.InDatabase(async db =>
            id = await db.CruiseApplications.Select(row => row.Id).SingleAsync(ct)
        );
        return id;
    }

    private static Task<HttpResponseMessage> Write(
        HttpClient client,
        string route,
        FormAFields form,
        bool draft
    ) =>
        client.PutFormAsync(
            route,
            new FormAWriteRequest { Form = form, Draft = draft },
            TestContext.Current.CancellationToken
        );

    private static async Task AssertFiles(
        TestApplication app,
        HttpClient client,
        Guid id,
        FileContent[] expected
    )
    {
        var ct = TestContext.Current.CancellationToken;
        var read = await client.GetFromJsonAsync<FormAFields>($"/v2/applications/{id}/form-a", ct);
        Assert.Equal(Pairs(expected), Pairs(read!.ResearchAreaFiles));
        await app.InDatabase(async db =>
        {
            var formA = await db.FormsA.SingleAsync(ct);
            var stored = await db.FormAResearchAreaFiles.ToListAsync(ct);
            Assert.Equal(expected.Length, stored.Count);
            Assert.All(stored, file => Assert.Equal(formA.Id, file.FormAId));
            foreach (var file in expected)
            {
                var row = Assert.Single(stored, row => row.FileName == file.Name);
                using var input = new MemoryStream(row.FileContent);
                await using var gzip = new GZipStream(input, CompressionMode.Decompress);
                using var reader = new StreamReader(gzip, Encoding.UTF8);
                Assert.Equal(file.Content, await reader.ReadToEndAsync(ct));
            }
        });
    }
}
