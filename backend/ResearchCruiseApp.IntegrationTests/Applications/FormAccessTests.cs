using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.IntegrationTests.Auth;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Applications;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class FormAccessTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    // BE-ACCESS-002: a valid body cannot bypass route-level create permissions.
    [Theory]
    [InlineData("anonymous", HttpStatusCode.Unauthorized)]
    [InlineData(RoleName.Guest, HttpStatusCode.Forbidden)]
    [InlineData(RoleName.ShipCrew, HttpStatusCode.Forbidden)]
    public async Task CreateDraft_WhenActorCannotEdit_RejectsWithoutWrites(
        string role,
        HttpStatusCode expected
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var manager = await TestUsers.Create(
            app,
            "manager@example.invalid",
            RoleName.CruiseManager
        );
        using var client = app.CreateApiClient();
        if (role != "anonymous")
        {
            var actor = await TestUsers.Create(app, "actor@example.invalid", role);
            var session = await RefreshSessionTests.Login(client, actor.Email!);
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
                "Bearer",
                session.Access
            );
        }

        using var response = await client.PostAsJsonAsync(
            "/v2/applications",
            new FormAWriteRequest { Form = Draft(Guid.Parse(manager.Id)), Draft = true },
            ct
        );

        Assert.Equal(expected, response.StatusCode);
        await app.InDatabase(async db =>
        {
            Assert.Empty(await db.CruiseApplications.ToListAsync(ct));
            Assert.Empty(await db.FormsA.ToListAsync(ct));
            Assert.Empty(await db.FormAUgUnits.ToListAsync(ct));
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        Assert.Empty(app.Transport.Messages);
    }

    // BE-ACCESS-003: drafts are readable only by their manager/deputy, even for privileged roles.
    [Theory]
    [InlineData("owner", HttpStatusCode.OK)]
    [InlineData("deputy", HttpStatusCode.OK)]
    [InlineData("anonymous", HttpStatusCode.Unauthorized)]
    [InlineData(RoleName.CruiseManager, HttpStatusCode.NotFound)]
    [InlineData(RoleName.Administrator, HttpStatusCode.NotFound)]
    [InlineData(RoleName.Shipowner, HttpStatusCode.NotFound)]
    [InlineData(RoleName.Guest, HttpStatusCode.NotFound)]
    [InlineData(RoleName.ShipCrew, HttpStatusCode.NotFound)]
    public async Task ReadDraft_WhenActorRequestsAnotherApplication_EnforcesOwnership(
        string actor,
        HttpStatusCode expected
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var draft = await CreateDraft(app);
        using var client = await ActorClient(app, actor);

        using var response = await client.GetAsync($"/v2/applications/{draft.Id}/form-a", ct);

        Assert.Equal(expected, response.StatusCode);
        if (expected == HttpStatusCode.OK)
        {
            var form = await response.Content.ReadFromJsonAsync<FormAFields>(ct);
            Assert.NotNull(form);
            Assert.Equal(draft.Owner, form.CruiseManagerId);
            Assert.Equal(draft.Deputy, form.DeputyManagerId);
        }
        await app.InDatabase(async db =>
        {
            var row = Assert.Single(await db.CruiseApplications.ToListAsync(ct));
            Assert.Equal("Original", row.Note);
            Assert.Equal(CruiseApplicationStatus.Draft, row.Status);
            Assert.Single(await db.FormsA.ToListAsync(ct));
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        Assert.Empty(app.Transport.Messages);
    }

    // BE-ACCESS-004/005: only manager/deputy or Administrator can replace a draft form.
    [Theory]
    [InlineData("owner", HttpStatusCode.NoContent)]
    [InlineData("deputy", HttpStatusCode.NoContent)]
    [InlineData(RoleName.Administrator, HttpStatusCode.NoContent)]
    [InlineData("anonymous", HttpStatusCode.Unauthorized)]
    [InlineData(RoleName.CruiseManager, HttpStatusCode.NotFound)]
    [InlineData(RoleName.Shipowner, HttpStatusCode.NotFound)]
    [InlineData(RoleName.Guest, HttpStatusCode.Forbidden)]
    [InlineData(RoleName.ShipCrew, HttpStatusCode.Forbidden)]
    public async Task UpdateDraft_WhenActorRequestsEdit_EnforcesOwnershipAndPreservesRejectedState(
        string actor,
        HttpStatusCode expected
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var draft = await CreateDraft(app);
        Guid originalForm = default;
        await app.InDatabase(async db => originalForm = (await db.FormsA.SingleAsync(ct)).Id);
        using var client = await ActorClient(app, actor);

        using var response = await client.PutAsJsonAsync(
            $"/v2/applications/{draft.Id}/form-a",
            new FormAWriteRequest
            {
                Form = Draft(draft.Owner, draft.Deputy, "Edited"),
                Draft = true,
            },
            ct
        );

        Assert.Equal(expected, response.StatusCode);
        var allowed = expected == HttpStatusCode.NoContent;
        await app.InDatabase(async db =>
        {
            var row = Assert.Single(
                await db.CruiseApplications.Include(row => row.FormA).ToListAsync(ct)
            );
            Assert.Equal(draft.Id, row.Id);
            Assert.Equal(allowed ? "Edited" : "Original", row.Note);
            Assert.Equal(CruiseApplicationStatus.Draft, row.Status);
            Assert.Equal(draft.Owner, row.FormA!.CruiseManagerId);
            Assert.Equal(draft.Deputy, row.FormA.DeputyManagerId);
            var form = Assert.Single(await db.FormsA.ToListAsync(ct));
            if (!allowed)
                Assert.Equal(originalForm, form.Id);
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        using var owner = await ActorClient(app, "owner");
        using var read = await owner.GetAsync($"/v2/applications/{draft.Id}/form-a", ct);
        Assert.Equal(HttpStatusCode.OK, read.StatusCode);
        Assert.Empty(app.Transport.Messages);
    }

    // BE-ACCESS-004: assignment grants shipowners edit access; a request body cannot grant it.
    [Theory]
    [InlineData("owner", HttpStatusCode.NoContent)]
    [InlineData("deputy", HttpStatusCode.NoContent)]
    [InlineData("unrelated", HttpStatusCode.NotFound)]
    public async Task UpdateDraft_WhenShipownerChangesForm_RequiresExistingAssignment(
        string relationship,
        HttpStatusCode expected
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var draft = await CreateDraft(app);
        var shipowner = await TestUsers.Create(
            app,
            "shipowner@example.invalid",
            RoleName.Shipowner
        );
        var actorId = Guid.Parse(shipowner.Id);
        var ownerId = relationship == "owner" ? actorId : draft.Owner;
        var deputyId = relationship == "deputy" ? actorId : draft.Deputy;
        await app.InDatabase(async db =>
        {
            var form = await db.FormsA.SingleAsync(ct);
            form.CruiseManagerId = ownerId;
            form.DeputyManagerId = deputyId;
            await db.SaveChangesAsync(ct);
        });
        using var client = app.CreateApiClient();
        var session = await RefreshSessionTests.Login(client, shipowner.Email!);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            session.Access
        );

        // An unrelated shipowner attempts to name themselves manager in the replacement.
        using var response = await client.PutAsJsonAsync(
            $"/v2/applications/{draft.Id}/form-a",
            new FormAWriteRequest
            {
                Form = Draft(
                    relationship == "unrelated" ? actorId : ownerId,
                    deputyId,
                    "Shipowner edit"
                ),
                Draft = true,
            },
            ct
        );

        Assert.Equal(expected, response.StatusCode);
        await app.InDatabase(async db =>
        {
            var application = Assert.Single(await db.CruiseApplications.ToListAsync(ct));
            Assert.Equal(
                relationship == "unrelated" ? "Original" : "Shipowner edit",
                application.Note
            );
            var form = Assert.Single(await db.FormsA.ToListAsync(ct));
            Assert.Equal(ownerId, form.CruiseManagerId);
            Assert.Equal(deputyId, form.DeputyManagerId);
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        Assert.Empty(app.Transport.Messages);
    }

    // BE-ACCESS-006: the same ownership rule protects the later form endpoints.
    [Theory]
    [InlineData("b")]
    [InlineData("c")]
    public async Task WriteLaterForm_WhenShipownerIsUnrelated_DeniesWithoutWrites(string form)
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var draft = await CreateDraft(app);
        using var client = await ActorClient(app, RoleName.Shipowner);
        HttpResponseMessage response;
        if (form == "b")
            response = await client.PutAsJsonAsync(
                $"/v2/applications/{draft.Id}/form-b",
                new FormBWriteRequest
                {
                    Form = new FormBFields { IsCruiseManagerPresent = "" },
                    Draft = true,
                },
                ct
            );
        else
            response = await client.PutAsJsonAsync(
                $"/v2/applications/{draft.Id}/form-c",
                new FormCWriteRequest
                {
                    Form = new FormCFields { ShipUsage = "", DifferentUsage = "" },
                    Draft = true,
                },
                ct
            );
        using (response)
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        await app.InDatabase(async db =>
        {
            var application = Assert.Single(await db.CruiseApplications.ToListAsync(ct));
            Assert.Equal(CruiseApplicationStatus.Draft, application.Status);
            Assert.Equal("Original", application.Note);
            Assert.Empty(await db.FormsB.ToListAsync(ct));
            Assert.Empty(await db.FormsC.ToListAsync(ct));
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        Assert.Empty(app.Transport.Messages);
    }

    private static async Task<(Guid Id, Guid Owner, Guid Deputy)> CreateDraft(TestApplication app)
    {
        var ct = TestContext.Current.CancellationToken;
        var owner = await TestUsers.Create(app, "owner@example.invalid", RoleName.CruiseManager);
        var deputy = await TestUsers.Create(app, "deputy@example.invalid", RoleName.CruiseManager);
        using var client = app.CreateApiClient();
        var session = await RefreshSessionTests.Login(client, owner.Email!);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            session.Access
        );
        var ownerId = Guid.Parse(owner.Id);
        var deputyId = Guid.Parse(deputy.Id);
        using var response = await client.PostAsJsonAsync(
            "/v2/applications",
            new FormAWriteRequest { Form = Draft(ownerId, deputyId), Draft = true },
            ct
        );
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        Guid id = default;
        await app.InDatabase(async db => id = (await db.CruiseApplications.SingleAsync(ct)).Id);
        return (id, ownerId, deputyId);
    }

    private static async Task<HttpClient> ActorClient(TestApplication app, string actor)
    {
        var client = app.CreateApiClient();
        if (actor == "anonymous")
            return client;
        try
        {
            var email = actor is "owner" or "deputy"
                ? actor + "@example.invalid"
                : (await TestUsers.Create(app, "actor@example.invalid", actor)).Email!;
            var session = await RefreshSessionTests.Login(client, email);
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
                "Bearer",
                session.Access
            );
            return client;
        }
        catch
        {
            client.Dispose();
            throw;
        }
    }

    internal static FormAFields Draft(
        Guid managerId,
        Guid? deputyId = null,
        string note = "Original"
    ) =>
        new()
        {
            CruiseManagerId = managerId,
            DeputyManagerId = deputyId,
            Year = "2030",
            CruiseHours = "0",
            PeriodNotes = "",
            DifferentUsage = "",
            CruiseGoalDescription = "",
            SupervisorEmail = "",
            Note = note,
        };
}
