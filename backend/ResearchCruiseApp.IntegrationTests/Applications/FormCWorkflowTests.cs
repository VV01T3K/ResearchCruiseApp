using System.Net;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Applications;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class FormCWorkflowTests(SqlFixture fixture) : IAsyncLifetime
{
    private const string Png =
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a1xkAAAAASUVORK5CYII=";

    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    [Fact]
    public async Task FormC_WhenPhotosAreReplacedThenRemoved_StoresOnlyCurrentFilesAndCanBeReopened()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var application = await TestApplications.Create(app, CruiseApplicationStatus.Undertaken);
        var office = await TestUsers.Create(app, "office@example.invalid", RoleName.Shipowner);
        using var manager = await TestApplications.Login(app, application.OwnerEmail);
        using var shipowner = await TestApplications.Login(app, office.Email!);
        var route = $"/v2/applications/{application.Id}/form-c";
        using var unsentRefill = await shipowner.PutAsync(route + "/refill", null, ct);
        Assert.Equal(HttpStatusCode.BadRequest, unsentRefill.StatusCode);
        Assert.Contains("już dostępny do edycji", await unsentRefill.Content.ReadAsStringAsync(ct));

        using var saved = await manager.PutFormAsync(
            route,
            new FormCWriteRequest { Form = Fields("first.png"), Draft = true },
            ct
        );
        Assert.Equal(HttpStatusCode.OK, saved.StatusCode);
        await AssertState(app, CruiseApplicationStatus.Undertaken, "first.png");
        using var read = await manager.GetAsync(route, ct);
        Assert.Equal(HttpStatusCode.OK, read.StatusCode);
        var body = await read.Content.ReadFromJsonAsync<FormCFields>(ct);
        var photo = Assert.Single(body!.Photos);
        Assert.Equal("first.png", photo.Name);
        Assert.Equal(Png, photo.Content);

        using var replaced = await manager.PutFormAsync(
            route,
            new FormCWriteRequest { Form = Fields("replacement.png"), Draft = true },
            ct
        );
        Assert.Equal(HttpStatusCode.OK, replaced.StatusCode);
        await AssertState(app, CruiseApplicationStatus.Undertaken, "replacement.png");

        using var submitted = await manager.PutFormAsync(
            route,
            new FormCWriteRequest { Form = Fields(null), Draft = false },
            ct
        );
        Assert.Equal(HttpStatusCode.OK, submitted.StatusCode);
        await AssertState(app, CruiseApplicationStatus.Reported, null);
        using var locked = await manager.PutFormAsync(
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
        using var reopened = await shipowner.PutAsync(route + "/refill", null, ct);
        Assert.Equal(HttpStatusCode.NoContent, reopened.StatusCode);
        await AssertState(app, CruiseApplicationStatus.Undertaken, null);
        Assert.Empty(app.Transport.Messages);
    }

    [Fact]
    public async Task FormC_WhenFormBIsReopenedAfterCruiseEnded_RefusesUntilFormBIsSent()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var application = await TestApplications.Create(app, CruiseApplicationStatus.FormBRequired);
        await app.InDatabase(async db =>
        {
            db.Cruises.Add(
                new Cruise
                {
                    Number = "2030/1",
                    StartDate = "2030-06-01",
                    EndDate = "2030-06-02",
                    Status = CruiseStatus.Ended,
                    CruiseApplications =
                    [
                        await db.CruiseApplications.SingleAsync(
                            row => row.Id == application.Id,
                            ct
                        ),
                    ],
                }
            );
            await db.SaveChangesAsync(ct);
        });
        using var manager = await TestApplications.Login(app, application.OwnerEmail);

        using var refused = await manager.PutFormAsync(
            $"/v2/applications/{application.Id}/form-c",
            new FormCWriteRequest { Form = Fields(null), Draft = false },
            ct
        );

        Assert.Equal(HttpStatusCode.Forbidden, refused.StatusCode);
        Assert.Contains("po wysłaniu formularza B", await refused.Content.ReadAsStringAsync(ct));
    }

    [Fact]
    public async Task FormC_WhenRevisionIsStaleOrMissing_RejectsSaveWithoutChanges()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var application = await TestApplications.Create(app, CruiseApplicationStatus.Undertaken);
        using var first = await TestApplications.Login(app, application.OwnerEmail);
        using var second = await TestApplications.Login(app, application.OwnerEmail);
        var route = $"/v2/applications/{application.Id}/form-c";
        var read = await FormRequests.CurrentRevision(second, route);

        using var saved = await first.PutFormAsync(
            route,
            new FormCWriteRequest { Form = Fields("first.png"), Draft = true },
            ct
        );
        Assert.Equal(HttpStatusCode.OK, saved.StatusCode);
        var snapshot = await FormRequests.Snapshot(app);
        var stale = Fields("stale.png");
        foreach (var revision in new[] { read, null })
        {
            stale.Revision = revision;
            using var rejected = await second.PutAsJsonAsync(
                route,
                new FormCWriteRequest { Form = stale, Draft = false },
                ct
            );
            Assert.Equal(HttpStatusCode.Conflict, rejected.StatusCode);
            Assert.Equal(snapshot, await FormRequests.Snapshot(app));
        }
        await AssertState(app, CruiseApplicationStatus.Undertaken, "first.png");
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
