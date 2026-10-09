using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Applications;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class LaterFormAccessTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    // BE-ACCESS-007/008: test route policies and existing assignment on editable B/C applications.
    // Forms B and C share one access check, so each actor runs once. Every outcome still runs on
    // both routes, and the owner and anonymous cases run on both.
    [Theory]
    [InlineData("b", "owner", HttpStatusCode.Created)]
    [InlineData("c", "owner", HttpStatusCode.Created)]
    [InlineData("c", "deputy", HttpStatusCode.Created)]
    [InlineData("b", RoleName.Administrator, HttpStatusCode.Created)]
    [InlineData("c", "shipowner-owner", HttpStatusCode.Created)]
    [InlineData("b", "shipowner-deputy", HttpStatusCode.Created)]
    [InlineData("b", "anonymous", HttpStatusCode.Unauthorized)]
    [InlineData("c", "anonymous", HttpStatusCode.Unauthorized)]
    [InlineData("b", RoleName.CruiseManager, HttpStatusCode.NotFound)]
    [InlineData("c", RoleName.Shipowner, HttpStatusCode.NotFound)]
    [InlineData("b", RoleName.Guest, HttpStatusCode.Forbidden)]
    [InlineData("c", RoleName.ShipCrew, HttpStatusCode.Forbidden)]
    public async Task Write_WhenActorRequestsLaterForm_EnforcesAssignmentAndPreservesDeniedState(
        string form,
        string actor,
        HttpStatusCode expected
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var editable =
            form == "b"
                ? CruiseApplicationStatus.FormBRequired
                : CruiseApplicationStatus.Undertaken;
        var application = await TestApplications.Create(app, editable);
        var deputy = await TestUsers.Create(app, "deputy@example.invalid", RoleName.CruiseManager);
        var unit = new UgUnit { Name = "Access faculty", IsActive = true };
        var email = application.OwnerEmail;
        Guid actorId = default;
        if (actor == "deputy")
            email = deputy.Email!;
        else if (actor is not "owner" and not "anonymous")
        {
            var user = await TestUsers.Create(
                app,
                "actor@example.invalid",
                actor.StartsWith("shipowner-", StringComparison.Ordinal)
                    ? RoleName.Shipowner
                    : actor
            );
            email = user.Email!;
            actorId = Guid.Parse(user.Id);
        }
        await app.InDatabase(async db =>
        {
            var row = await db.CruiseApplications.Include(row => row.FormA).SingleAsync(ct);
            row.Note = "Original access note";
            row.FormA!.DeputyManagerId = Guid.Parse(deputy.Id);
            if (actor == "shipowner-owner")
                row.FormA.CruiseManagerId = actorId;
            if (actor == "shipowner-deputy")
                row.FormA.DeputyManagerId = actorId;
            db.UgUnits.Add(unit);
            await db.SaveChangesAsync(ct);
        });
        using var client =
            actor == "anonymous" ? app.CreateApiClient() : await TestApplications.Login(app, email);
        // Assigned shipowners may replace the original owner in this fixture.
        using var reader = await TestApplications.Login(
            app,
            actor == "shipowner-owner" ? email : application.OwnerEmail
        );
        var route = $"/v2/applications/{application.Id}/form-{form}";
        var initial = await Capture(app);
        Assert.Equal(editable, initial.Status);
        using var missing = await reader.GetAsync(route, ct);
        Assert.Equal(HttpStatusCode.NotFound, missing.StatusCode);

        using var created = await Write(client, route, form, unit.Id, "2", true, ct);
        Assert.Equal(expected, created.StatusCode);
        var allowed = expected == HttpStatusCode.Created;
        if (!allowed)
        {
            Assert.Equal(initial, await Capture(app));
            using var absent = await reader.GetAsync(route, ct);
            Assert.Equal(HttpStatusCode.NotFound, absent.StatusCode);
            using var control = await Write(reader, route, form, unit.Id, "2", true, ct);
            Assert.Equal(HttpStatusCode.Created, control.StatusCode);
        }
        await AssertSaved(app, reader, route, form, editable, "2", unit.Id);
        var saved = await Capture(app);
        Assert.Equal(initial.Application, saved.Application);
        using var savedRead = await reader.GetAsync(route, ct);
        var savedBody = await savedRead.Content.ReadAsStringAsync(ct);

        foreach (var draft in new[] { true, false })
        {
            using var response = await Write(client, route, form, unit.Id, "3", draft, ct);
            Assert.Equal(expected, response.StatusCode);
            if (!allowed)
            {
                Assert.Equal(saved, await Capture(app));
                using var unchanged = await reader.GetAsync(route, ct);
                Assert.Equal(HttpStatusCode.OK, unchanged.StatusCode);
                Assert.Equal(savedBody, await unchanged.Content.ReadAsStringAsync(ct));
            }
            var status =
                allowed && !draft
                    ? form == "b"
                        ? CruiseApplicationStatus.FormBFilled
                        : CruiseApplicationStatus.Reported
                    : editable;
            await AssertSaved(app, reader, route, form, status, allowed ? "3" : "2", unit.Id);
            Assert.Equal(initial.Application, (await Capture(app)).Application);
        }
        await app.Dispatch(ct);
        Assert.Empty(app.Transport.Messages);
    }

    private static Task<HttpResponseMessage> Write(
        HttpClient client,
        string route,
        string form,
        Guid unitId,
        string employees,
        bool draft,
        CancellationToken ct
    )
    {
        var team = new UgTeamFields
        {
            UgUnitId = unitId,
            NoOfEmployees = employees,
            NoOfStudents = "0",
        };
        return form == "b"
            ? client.PutAsJsonAsync(
                route,
                new FormBWriteRequest
                {
                    Form = new FormBFields { IsCruiseManagerPresent = "true", UgTeams = [team] },
                    Draft = draft,
                },
                ct
            )
            : client.PutAsJsonAsync(
                route,
                new FormCWriteRequest
                {
                    Form = new FormCFields
                    {
                        ShipUsage = "0",
                        DifferentUsage = "",
                        UgTeams = [team],
                    },
                    Draft = draft,
                },
                ct
            );
    }

    private static async Task AssertSaved(
        TestApplication app,
        HttpClient reader,
        string route,
        string form,
        CruiseApplicationStatus status,
        string employees,
        Guid unitId
    )
    {
        var ct = TestContext.Current.CancellationToken;
        using var response = await reader.GetAsync(route, ct);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var teams =
            form == "b"
                ? (await response.Content.ReadFromJsonAsync<FormBFields>(ct))!.UgTeams
                : (await response.Content.ReadFromJsonAsync<FormCFields>(ct))!.UgTeams;
        var team = Assert.Single(teams);
        Assert.Equal(unitId, team.UgUnitId);
        Assert.Equal(employees, team.NoOfEmployees);
        Assert.Equal("0", team.NoOfStudents);
        await app.InDatabase(async db =>
        {
            Assert.Equal(status, (await db.CruiseApplications.SingleAsync(ct)).Status);
            Assert.Equal(form == "b" ? 1 : 0, await db.FormsB.CountAsync(ct));
            Assert.Equal(form == "c" ? 1 : 0, await db.FormsC.CountAsync(ct));
            Assert.Equal(form == "b" ? 1 : 0, await db.FormBUgUnits.CountAsync(ct));
            Assert.Equal(form == "c" ? 1 : 0, await db.FormCUgUnits.CountAsync(ct));
            if (form == "b")
            {
                var stored = await db.FormBUgUnits.Include(row => row.UgUnit).SingleAsync(ct);
                Assert.Equal(unitId, stored.UgUnit.Id);
                Assert.Equal(employees, stored.NoOfEmployees);
                Assert.Equal("0", stored.NoOfStudents);
            }
            else
            {
                var stored = await db.FormCUgUnits.Include(row => row.UgUnit).SingleAsync(ct);
                Assert.Equal(unitId, stored.UgUnit.Id);
                Assert.Equal(employees, stored.NoOfEmployees);
                Assert.Equal("0", stored.NoOfStudents);
            }
        });
    }

    private sealed record SavedState(
        CruiseApplicationStatus Status,
        string Application,
        string Forms
    );

    private static async Task<SavedState> Capture(TestApplication app)
    {
        var ct = TestContext.Current.CancellationToken;
        SavedState? state = null;
        await app.InDatabase(async db =>
        {
            var row = await db.CruiseApplications.Include(row => row.FormA).SingleAsync(ct);
            Assert.Single(await db.FormsA.ToListAsync(ct));
            Assert.Empty(await db.UserEffects.ToListAsync(ct));
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
            state = new SavedState(
                row.Status,
                JsonSerializer.Serialize(
                    new
                    {
                        row.Id,
                        row.Number,
                        row.Date,
                        row.Note,
                        row.EffectsPoints,
                        row.SupervisorCode,
                        FormAId = row.FormA!.Id,
                        row.FormA.CruiseManagerId,
                        row.FormA.DeputyManagerId,
                    }
                ),
                JsonSerializer.Serialize(
                    new
                    {
                        B = await db
                            .FormsB.Select(form => new { form.Id, form.IsCruiseManagerPresent })
                            .ToListAsync(ct),
                        C = await db
                            .FormsC.Select(form => new
                            {
                                form.Id,
                                form.ShipUsage,
                                form.DifferentUsage,
                            })
                            .ToListAsync(ct),
                        BTeams = await db
                            .FormBUgUnits.Select(team => new
                            {
                                team.Id,
                                FormId = team.FormB.Id,
                                UnitId = team.UgUnit.Id,
                                team.NoOfEmployees,
                                team.NoOfStudents,
                            })
                            .ToListAsync(ct),
                        CTeams = await db
                            .FormCUgUnits.Select(team => new
                            {
                                team.Id,
                                FormId = team.FormC.Id,
                                UnitId = team.UgUnit.Id,
                                team.NoOfEmployees,
                                team.NoOfStudents,
                            })
                            .ToListAsync(ct),
                    }
                )
            );
        });
        return state!;
    }
}
