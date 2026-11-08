using System.Globalization;
using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.IntegrationTests.Auth;
using ResearchCruiseApp.IntegrationTests.Cruises;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Applications;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class FormAWorkflowTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    [Theory]
    [InlineData(true, true)]
    [InlineData(true, false)]
    [InlineData(false, true)]
    [InlineData(false, false)]
    public async Task Submit_WhenSupervisorAndOfficeDecide_PersistsFormInvitationAndFinalStatus(
        bool fromDraft,
        bool officeAccepts
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var manager = await TestUsers.Create(
            app,
            "form-a-manager@example.invalid",
            RoleName.CruiseManager
        );
        var deputy = await TestUsers.Create(
            app,
            "form-a-deputy@example.invalid",
            RoleName.CruiseManager
        );
        var office = await TestUsers.Create(
            app,
            "form-a-office@example.invalid",
            RoleName.Shipowner
        );
        var unit = new UgUnit { Name = "Synthetic faculty", IsActive = true };
        await app.InDatabase(async db =>
        {
            db.UgUnits.Add(unit);
            await db.SaveChangesAsync(ct);
        });
        using var client = await TestApplications.Login(app, manager.Email!);
        Guid id = default;
        if (fromDraft)
        {
            var draft = FormAccessTests.Draft(Guid.Parse(manager.Id), Guid.Parse(deputy.Id));
            using var created = await client.PostAsJsonAsync(
                "/v2/applications",
                new FormAWriteRequest { Form = draft, Draft = true },
                ct
            );
            Assert.Equal(HttpStatusCode.Created, created.StatusCode);
            await app.InDatabase(async db => id = (await db.CruiseApplications.SingleAsync(ct)).Id);
            using var invalid = await client.PutFormAsync(
                $"/v2/applications/{id}/form-a",
                new FormAWriteRequest { Form = draft, Draft = false },
                ct
            );
            Assert.Equal(HttpStatusCode.BadRequest, invalid.StatusCode);
            await app.InDatabase(async db =>
            {
                Assert.Equal(
                    CruiseApplicationStatus.Draft,
                    (await db.CruiseApplications.SingleAsync(ct)).Status
                );
                Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
            });
        }
        var form = CompleteForm(Guid.Parse(manager.Id), Guid.Parse(deputy.Id), unit.Id);
        var request = new FormAWriteRequest { Form = form, Draft = false };
        using var submitted = fromDraft
            ? await client.PutFormAsync($"/v2/applications/{id}/form-a", request, ct)
            : await client.PostAsJsonAsync("/v2/applications", request, ct);
        Assert.True(
            submitted.StatusCode == (fromDraft ? HttpStatusCode.OK : HttpStatusCode.Created),
            await submitted.Content.ReadAsStringAsync(ct)
        );
        await app.InDatabase(async db =>
        {
            var application = await db.CruiseApplications.SingleAsync(ct);
            id = application.Id;
            Assert.Equal(CruiseApplicationStatus.WaitingForSupervisor, application.Status);
            Assert.Single(await db.FormsA.ToListAsync(ct));
            Assert.Single(await db.FormAUgUnits.ToListAsync(ct));
            Assert.Single(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        var read = await client.GetFromJsonAsync<FormAFields>($"/v2/applications/{id}/form-a", ct);
        Assert.NotNull(read);
        Assert.Equal(unit.Id, Assert.Single(read.UgTeams).UgUnitId);
        Assert.Equal("2", Assert.Single(read.UgTeams).NoOfEmployees);
        Assert.Equal("Synthetic thesis", Assert.Single(read.ResearchTasks).Title);
        using var locked = await client.PutFormAsync($"/v2/applications/{id}/form-a", request, ct);
        Assert.Equal(HttpStatusCode.Forbidden, locked.StatusCode);
        Assert.Empty(app.Transport.Messages);
        await app.Dispatch(ct);
        var mail = Assert.Single(app.Transport.Messages);
        Assert.Equal("supervisor@example.invalid", mail.Payload.Recipient);
        var query = QueryHelpers.ParseQuery(
            PasswordRecoveryTests.Link(mail.Payload.Body, "cruise-approval").Query
        );
        Assert.Equal(id.ToString(), query["cruiseApplicationId"].ToString());
        var code = query["supervisorCode"].ToString();
        Assert.NotEmpty(code);
        using var supervisor = app.CreateApiClient();
        using var review = await supervisor.GetAsync(
            $"/v2/applications/{id}/supervisor-review?code={Uri.EscapeDataString(code)}",
            ct
        );
        Assert.Equal(HttpStatusCode.OK, review.StatusCode);
        using var approved = await supervisor.PutAsJsonAsync(
            $"/v2/applications/{id}/supervisor-review/decision",
            new SupervisorDecisionRequest(true, code),
            ct
        );
        Assert.Equal(HttpStatusCode.NoContent, approved.StatusCode);
        using var officeClient = await TestApplications.Login(app, office.Email!);
        using var decision = await officeClient.PutAsJsonAsync(
            $"/v2/applications/{id}/decision",
            new ApplicationDecisionRequest(
                officeAccepts,
                await FormRequests.ApplicationRevision(officeClient, id)
            ),
            ct
        );
        Assert.Equal(HttpStatusCode.NoContent, decision.StatusCode);
        await app.InDatabase(async db =>
        {
            var stored = await db.CruiseApplications.Include(row => row.FormA).SingleAsync(ct);
            Assert.Equal(
                officeAccepts ? CruiseApplicationStatus.Accepted : CruiseApplicationStatus.Denied,
                stored.Status
            );
            Assert.Equal(Guid.Parse(manager.Id), stored.FormA!.CruiseManagerId);
            Assert.Equal(Guid.Parse(deputy.Id), stored.FormA.DeputyManagerId);
            Assert.Single(await db.FormsA.ToListAsync(ct));
            Assert.Single(await db.FormAUgUnits.ToListAsync(ct));
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        Assert.Single(app.Transport.Messages);
    }

    [Theory]
    [InlineData("guest")]
    [InlineData("deactivated")]
    public async Task Save_WhenAssigneeCannotLeadCruises_RejectsNewSelectionButKeepsExistingDraft(
        string change
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var submitter = await TestUsers.Create(
            app,
            "form-a-manager@example.invalid",
            RoleName.CruiseManager
        );
        var assignee = await TestUsers.Create(
            app,
            "form-a-deputy@example.invalid",
            RoleName.CruiseManager
        );
        await TestUsers.Create(app, "form-a-office@example.invalid", RoleName.Administrator);
        await TestUsers.Create(app, "role-holder@example.invalid", RoleName.Guest);
        using var client = await TestApplications.Login(app, submitter.Email!);
        var draft = new FormAWriteRequest
        {
            Form = FormAccessTests.Draft(Guid.Parse(submitter.Id), Guid.Parse(assignee.Id)),
            Draft = true,
        };
        using var created = await client.PostAsJsonAsync("/v2/applications", draft, ct);
        Assert.Equal(HttpStatusCode.Created, created.StatusCode);
        Guid id = default;
        await app.InDatabase(async db => id = (await db.CruiseApplications.SingleAsync(ct)).Id);
        using var office = await TestApplications.Login(app, "form-a-office@example.invalid");
        using var changed =
            change == "guest"
                ? await office.PutAsJsonAsync(
                    $"/v2/users/{assignee.Id}/role",
                    new { roleName = RoleName.Guest },
                    ct
                )
                : await office.DeleteAsync($"/v2/users/{assignee.Id}/acceptance", ct);
        Assert.Equal(HttpStatusCode.NoContent, changed.StatusCode);

        var assigneeId = Guid.Parse(assignee.Id);
        var options = await client.GetFromJsonAsync<FormAOptions>(
            "/v2/applications/form-a/context",
            ct
        );
        Assert.DoesNotContain(options!.CruiseManagers, user => user.Id == assigneeId);
        Assert.DoesNotContain(options.DeputyManagers, user => user.Id == assigneeId);
        options = await client.GetFromJsonAsync<FormAOptions>(
            $"/v2/applications/form-a/context?applicationId={id}",
            ct
        );
        Assert.Contains(options!.DeputyManagers, user => user.Id == assigneeId);
        using var kept = await client.PutFormAsync($"/v2/applications/{id}/form-a", draft, ct);
        Assert.Equal(HttpStatusCode.OK, kept.StatusCode);
        using var rejected = await client.PostAsJsonAsync("/v2/applications", draft, ct);
        Assert.Equal(HttpStatusCode.BadRequest, rejected.StatusCode);
        await app.InDatabase(async db =>
            Assert.Single(await db.CruiseApplications.ToListAsync(ct))
        );
    }

    [Theory]
    [InlineData("2030-05-17T00:00:00Z", "2030-05-17T22:00:00Z", 24, HttpStatusCode.Created)]
    [InlineData("2030-05-16T22:00:00Z", "2030-05-18T00:00:00Z", 24, HttpStatusCode.Created)]
    [InlineData("2030-05-17T00:00:00Z", "2030-05-16T22:00:00Z", 25, HttpStatusCode.BadRequest)]
    [InlineData("2030-05-18T00:00:00Z", "2030-05-16T22:00:00Z", 24, HttpStatusCode.BadRequest)]
    [InlineData("2030-03-31T00:00:00Z", "2030-03-31T00:00:00Z", 24, HttpStatusCode.BadRequest)]
    [InlineData("2030-10-27T00:00:00Z", "2030-10-27T00:00:00Z", 25, HttpStatusCode.Created)]
    [InlineData("2030-12-02T23:00:00Z", "2030-12-04T23:00:00Z", 72, HttpStatusCode.Created)]
    [InlineData("2030-12-02T23:00:00Z", "2030-12-04T23:00:00Z", 73, HttpStatusCode.BadRequest)]
    [InlineData(
        "2030-05-16T22:00:00Z",
        "2030-05-17T22:00:00Z",
        24,
        HttpStatusCode.Created,
        "2030-05-17T22:00:00.000Z",
        "2030-05-18T22:00:00.000Z"
    )]
    [InlineData(
        "2030-03-30T23:00:00Z",
        "2030-03-30T23:00:00Z",
        1,
        HttpStatusCode.Conflict,
        "2030-03-30T23:00:00.000Z",
        "2030-03-31T22:00:00.000Z"
    )]
    [InlineData(
        "2030-12-02T23:00:00Z",
        "2030-12-04T23:00:00Z",
        49,
        HttpStatusCode.Conflict,
        "2030-12-04T23:00:00.000Z",
        "2030-12-05T23:00:00.000Z"
    )]
    [InlineData(
        "2030-12-02T23:00:00Z",
        "2030-12-04T23:00:00Z",
        58,
        HttpStatusCode.Created,
        null,
        null,
        "08:00",
        "18:00"
    )]
    [InlineData(
        "2030-12-02T23:00:00Z",
        "2030-12-04T23:00:00Z",
        59,
        HttpStatusCode.BadRequest,
        null,
        null,
        "08:00",
        "18:00"
    )]
    [InlineData(
        "2030-12-02T23:00:00Z",
        "2030-12-04T23:00:00Z",
        30,
        HttpStatusCode.Conflict,
        "2030-12-04T12:00:00.000Z",
        "2030-12-04T13:00:00.000Z",
        "08:00",
        "18:00"
    )]
    [InlineData(
        "2030-10-26T22:00:00Z",
        "2030-10-26T22:00:00Z",
        24,
        HttpStatusCode.Created,
        null,
        null,
        "00:00",
        "23:00"
    )]
    [InlineData(
        "2030-12-02T23:00:00Z",
        "2030-12-02T23:00:00Z",
        1,
        HttpStatusCode.BadRequest,
        null,
        null,
        "18:00",
        "08:00"
    )]
    public async Task Submit_ComparesPrecisePeriodAsPolishDays(
        string start,
        string end,
        int cruiseHours,
        HttpStatusCode expected,
        string? blockadeStart = null,
        string? blockadeEnd = null,
        string? startTime = null,
        string? endTime = null
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var manager = await TestUsers.Create(
            app,
            "manager@example.invalid",
            RoleName.CruiseManager
        );
        var deputy = await TestUsers.Create(app, "deputy@example.invalid", RoleName.CruiseManager);
        var unit = new UgUnit { Name = "Synthetic faculty", IsActive = true };
        await app.InDatabase(async db =>
        {
            db.UgUnits.Add(unit);
            if (blockadeStart is not null)
                db.Cruises.Add(AutoPlanTests.Existing("2029/1", blockadeStart, blockadeEnd!, true));
            await db.SaveChangesAsync(ct);
        });
        using var client = await TestApplications.Login(app, manager.Email!);
        var form = JsonSerializer
            .SerializeToNode(CompleteForm(Guid.Parse(manager.Id), Guid.Parse(deputy.Id), unit.Id))!
            .AsObject();
        form["PrecisePeriodStart"] = start;
        form["PrecisePeriodEnd"] = end;
        form["PrecisePeriodStartTime"] = startTime;
        form["PrecisePeriodEndTime"] = endTime;
        form["CruiseHours"] = cruiseHours.ToString(CultureInfo.InvariantCulture);

        using var response = await FormRequests.Write(
            client,
            "/v2/applications",
            form,
            false,
            true
        );

        Assert.Equal(expected, response.StatusCode);
    }

    internal static FormAFields CompleteForm(Guid manager, Guid deputy, Guid unit) =>
        new()
        {
            CruiseManagerId = manager,
            DeputyManagerId = deputy,
            Year = "2030",
            CruiseHours = "24",
            PrecisePeriodStart = new DateTime(2030, 5, 15),
            PrecisePeriodEnd = new DateTime(2030, 5, 17),
            ShipUsage = "0",
            CruiseGoal = "0",
            CruiseGoalDescription = "Synthetic research",
            PeriodNotes = "",
            DifferentUsage = "",
            SupervisorEmail = "supervisor@example.invalid",
            ResearchAreaDescriptions =
            [
                new ResearchAreaSelection { DifferentName = "Synthetic area" },
            ],
            ResearchTasks =
            [
                new ResearchTaskFields
                {
                    Type = "0",
                    Title = "Synthetic thesis",
                    Author = "Synthetic author",
                },
            ],
            UgTeams =
            [
                new UgTeamFields
                {
                    UgUnitId = unit,
                    NoOfEmployees = "2",
                    NoOfStudents = "0",
                },
            ],
        };
}
