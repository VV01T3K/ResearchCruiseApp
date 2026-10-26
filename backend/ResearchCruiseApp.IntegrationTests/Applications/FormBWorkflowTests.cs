using System.Net;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Api;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Applications;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class FormBWorkflowTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    [Fact]
    public async Task FormB_WhenSavedReplacedSubmittedAndReopened_PersistsExpectedStateAndChildren()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var application = await TestApplications.Create(app, CruiseApplicationStatus.FormBRequired);
        var office = await TestUsers.Create(app, "office@example.invalid", RoleName.Administrator);
        var unit = new UgUnit { Name = "Workflow faculty", IsActive = true };
        await app.InDatabase(async db =>
        {
            db.UgUnits.Add(unit);
            await db.SaveChangesAsync(ct);
        });
        using var manager = await TestApplications.Login(app, application.OwnerEmail);
        using var admin = await TestApplications.Login(app, office.Email!);
        var route = $"/v2/applications/{application.Id}/form-b";
        using var unsentRefill = await admin.PutAsync(route + "/refill", null, ct);
        Assert.Equal(HttpStatusCode.Forbidden, unsentRefill.StatusCode);
        Assert.Contains("już dostępny do edycji", await unsentRefill.Content.ReadAsStringAsync(ct));
        var first = Fields(unit.Id, "2");

        using var saved = await manager.PutFormAsync(
            route,
            new FormBWriteRequest { Form = first, Draft = true },
            ct
        );
        Assert.Equal(HttpStatusCode.OK, saved.StatusCode);
        await AssertState(app, CruiseApplicationStatus.FormBRequired, "2");
        using var read = await manager.GetAsync(route, ct);
        Assert.Equal(HttpStatusCode.OK, read.StatusCode);
        var body = await read.Content.ReadFromJsonAsync<FormBFields>(ct);
        Assert.Equal("2", Assert.Single(body!.UgTeams).NoOfEmployees);

        var replacement = Fields(unit.Id, "3");
        using var replaced = await manager.PutFormAsync(
            route,
            new FormBWriteRequest { Form = replacement, Draft = true },
            ct
        );
        Assert.Equal(HttpStatusCode.OK, replaced.StatusCode);
        await AssertState(app, CruiseApplicationStatus.FormBRequired, "3");

        using var submitted = await manager.PutFormAsync(
            route,
            new FormBWriteRequest { Form = replacement, Draft = false },
            ct
        );
        Assert.Equal(HttpStatusCode.OK, submitted.StatusCode);
        await AssertState(app, CruiseApplicationStatus.FormBFilled, "3");
        using var locked = await manager.PutFormAsync(
            route,
            new FormBWriteRequest { Form = first, Draft = true },
            ct
        );
        Assert.Equal(HttpStatusCode.Forbidden, locked.StatusCode);
        await AssertState(app, CruiseApplicationStatus.FormBFilled, "3");

        using var deniedRefill = await manager.PutAsync(route + "/refill", null, ct);
        Assert.Equal(HttpStatusCode.Forbidden, deniedRefill.StatusCode);
        using var reopened = await admin.PutAsync(route + "/refill", null, ct);
        Assert.Equal(HttpStatusCode.NoContent, reopened.StatusCode);
        await AssertState(app, CruiseApplicationStatus.FormBRequired, "3");
        using var staleRefill = await admin.PutAsync(route + "/refill", null, ct);
        Assert.Equal(HttpStatusCode.Forbidden, staleRefill.StatusCode);
        Assert.Contains("już dostępny do edycji", await staleRefill.Content.ReadAsStringAsync(ct));
        Assert.Empty(app.Transport.Messages);
    }

    [Fact]
    public async Task FormB_WhenRevisionIsStaleOrMissing_RejectsSaveWithoutChanges()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var application = await TestApplications.Create(app, CruiseApplicationStatus.FormBRequired);
        var unit = new UgUnit { Name = "Revision faculty", IsActive = true };
        await app.InDatabase(async db =>
        {
            db.UgUnits.Add(unit);
            await db.SaveChangesAsync(ct);
        });
        using var first = await TestApplications.Login(app, application.OwnerEmail);
        using var second = await TestApplications.Login(app, application.OwnerEmail);
        var route = $"/v2/applications/{application.Id}/form-b";
        var read = await FormRequests.CurrentRevision(second, route);

        using var saved = await first.PutFormAsync(
            route,
            new FormBWriteRequest { Form = Fields(unit.Id, "2"), Draft = true },
            ct
        );
        Assert.Equal(HttpStatusCode.OK, saved.StatusCode);
        var accepted = (await saved.Content.ReadFromJsonAsync<RevisionResponse>(ct))!.Revision;
        Assert.NotEqual(read, accepted);
        var snapshot = await FormRequests.Snapshot(app);
        var stale = Fields(unit.Id, "3");
        foreach (var revision in new[] { read, null })
        {
            stale.Revision = revision;
            using var rejected = await second.PutAsJsonAsync(
                route,
                new FormBWriteRequest { Form = stale, Draft = false },
                ct
            );
            Assert.Equal(HttpStatusCode.Conflict, rejected.StatusCode);
            Assert.Equal(snapshot, await FormRequests.Snapshot(app));
        }
        await AssertState(app, CruiseApplicationStatus.FormBRequired, "2");

        stale.Revision = accepted;
        using var resaved = await second.PutAsJsonAsync(
            route,
            new FormBWriteRequest { Form = stale, Draft = false },
            ct
        );
        Assert.Equal(HttpStatusCode.OK, resaved.StatusCode);
        await AssertState(app, CruiseApplicationStatus.FormBFilled, "3");
    }

    private static FormBFields Fields(Guid unitId, string employees) =>
        new()
        {
            IsCruiseManagerPresent = "true",
            UgTeams =
            [
                new UgTeamFields
                {
                    UgUnitId = unitId,
                    NoOfEmployees = employees,
                    NoOfStudents = "0",
                },
            ],
        };

    private static async Task AssertState(
        TestApplication app,
        CruiseApplicationStatus status,
        string employees
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await app.InDatabase(async db =>
        {
            Assert.Equal(status, (await db.CruiseApplications.SingleAsync(ct)).Status);
            Assert.Single(await db.FormsB.ToListAsync(ct));
            Assert.Equal(
                employees,
                Assert.Single(await db.FormBUgUnits.ToListAsync(ct)).NoOfEmployees
            );
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
    }
}
