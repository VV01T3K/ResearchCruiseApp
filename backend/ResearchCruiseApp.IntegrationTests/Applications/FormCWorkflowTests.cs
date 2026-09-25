using System.Net;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Applications;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class FormCWorkflowTests(SqlFixture fixture) : IAsyncLifetime
{
    private const string Png =
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a1xkAAAAASUVORK5CYII=";

    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    // BE-FORMC-001: photo replacement/deletion and completion/reopening persist across HTTP scopes.
    [Fact]
    public async Task FormC_WhenPhotosAreReplacedThenRemoved_StoresOnlyCurrentFilesAndCanBeReopened()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var application = await TestApplications.Create(app, CruiseApplicationStatus.Undertaken);
        var office = await TestUsers.Create(app, "office@example.invalid", RoleName.Shipowner);
        using var manager = await TestApplications.Login(app, application.OwnerEmail);
        var route = $"/v2/applications/{application.Id}/form-c";

        using var saved = await manager.PutAsJsonAsync(
            route,
            new FormCWriteRequest { Form = Fields("first.png"), Draft = true },
            ct
        );
        Assert.Equal(HttpStatusCode.Created, saved.StatusCode);
        await AssertState(app, CruiseApplicationStatus.Undertaken, "first.png");
        using var read = await manager.GetAsync(route, ct);
        Assert.Equal(HttpStatusCode.OK, read.StatusCode);
        var body = await read.Content.ReadFromJsonAsync<FormCFields>(ct);
        var photo = Assert.Single(body!.Photos);
        Assert.Equal("first.png", photo.Name);
        Assert.Equal(Png, photo.Content);

        using var replaced = await manager.PutAsJsonAsync(
            route,
            new FormCWriteRequest { Form = Fields("replacement.png"), Draft = true },
            ct
        );
        Assert.Equal(HttpStatusCode.Created, replaced.StatusCode);
        await AssertState(app, CruiseApplicationStatus.Undertaken, "replacement.png");

        using var submitted = await manager.PutAsJsonAsync(
            route,
            new FormCWriteRequest { Form = Fields(null), Draft = false },
            ct
        );
        Assert.Equal(HttpStatusCode.Created, submitted.StatusCode);
        await AssertState(app, CruiseApplicationStatus.Reported, null);
        using var locked = await manager.PutAsJsonAsync(
            route,
            new FormCWriteRequest { Form = Fields("forbidden.png"), Draft = true },
            ct
        );
        Assert.Equal(HttpStatusCode.Forbidden, locked.StatusCode);
        await AssertState(app, CruiseApplicationStatus.Reported, null);
        using var finalRead = await manager.GetAsync(route, ct);
        Assert.Equal(HttpStatusCode.OK, finalRead.StatusCode);
        Assert.Empty((await finalRead.Content.ReadFromJsonAsync<FormCFields>(ct))!.Photos);

        using var denied = await manager.PutAsync(route + "/refill", null, ct);
        Assert.Equal(HttpStatusCode.Forbidden, denied.StatusCode);
        using var shipowner = await TestApplications.Login(app, office.Email!);
        using var reopened = await shipowner.PutAsync(route + "/refill", null, ct);
        Assert.Equal(HttpStatusCode.NoContent, reopened.StatusCode);
        await AssertState(app, CruiseApplicationStatus.Undertaken, null);
        Assert.Empty(app.Transport.Messages);
    }

    private static FormCFields Fields(string? photo) =>
        new()
        {
            ShipUsage = "0",
            DifferentUsage = "",
            Photos = photo is null ? [] : [new FileContent { Name = photo, Content = Png }],
        };

    private static async Task AssertState(
        TestApplication app,
        CruiseApplicationStatus status,
        string? photo
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await app.InDatabase(async db =>
        {
            Assert.Equal(status, (await db.CruiseApplications.SingleAsync(ct)).Status);
            Assert.Single(await db.FormsC.ToListAsync(ct));
            var photos = await db.Photos.ToListAsync(ct);
            if (photo is null)
                Assert.Empty(photos);
            else
                Assert.Equal(photo, Assert.Single(photos).Name);
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
    }
}
