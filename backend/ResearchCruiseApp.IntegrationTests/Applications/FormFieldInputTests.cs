using System.Net;
using System.Net.Http.Json;
using System.Text;
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
public sealed class FormFieldInputTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    [Theory]
    [InlineData(0)]
    [InlineData(1)]
    [InlineData(2)]
    [InlineData(3)]
    public async Task Write_WhenStoredStringIsInvalid_RejectsWithoutBusinessChanges(int target)
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var prepared = await Prepare(app, target);
        using var client = prepared.Client;
        var original = await Snapshot(app);
        var originalHttp = target == 0 ? null : await Read(client, prepared.Route);
        var failures = new List<string>();
        // kind 0 sends null, 1 omits the key, 2 exceeds the column limit.
        foreach (var kind in new[] { 0, 1, 2 })
        foreach (var field in Boundaries(target))
        {
            if (kind != 2 && !field.Required)
                continue;
            var fields = (JsonObject)prepared.Fields.DeepClone();
            var parent = field.Collection is null
                ? fields
                : fields[field.Collection]![0]!.AsObject();
            if (kind == 1)
                parent.Remove(field.Property);
            else
                parent[field.Property] = kind == 0 ? null : new string('x', field.Limit + 1);
            using var response = await Write(client, prepared.Route, fields, true, target == 0);
            var path =
                $"form.{(field.Collection is null ? "" : JsonNamingPolicy.CamelCase.ConvertName(field.Collection) + "[0].")}{JsonNamingPolicy.CamelCase.ConvertName(field.Property)}";
            var body = await response.Content.ReadAsStringAsync(ct);
            if (
                response.StatusCode != HttpStatusCode.BadRequest
                || response.Content.Headers.ContentType?.MediaType != "application/problem+json"
            )
            {
                failures.Add($"{path} (kind {kind}): HTTP {(int)response.StatusCode}");
                continue;
            }
            using var problem = JsonDocument.Parse(body);
            if (
                !problem.RootElement.GetProperty("errors").TryGetProperty(path, out var errors)
                || errors.GetArrayLength() == 0
            )
                failures.Add($"{path} (kind {kind}): missing property error in {body}");
        }
        Assert.Equal(original, await Snapshot(app));
        if (target != 0)
            Assert.Equal(originalHttp, await Read(client, prepared.Route));
        await app.Dispatch(ct);
        Assert.Empty(app.Transport.Messages);
        Assert.True(failures.Count == 0, string.Join("; ", failures));
    }

    [Theory]
    [InlineData(0)]
    [InlineData(1)]
    [InlineData(2)]
    [InlineData(3)]
    public async Task Draft_WhenTextIsAtStorageLimit_RoundTripsAndAllowsNullableFields(int target)
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var prepared = await Prepare(app, target);
        using var client = prepared.Client;
        var fields = (JsonObject)prepared.Fields.DeepClone();
        var controls = Boundaries(target).Where(field => field.FreeText).ToArray();
        foreach (var field in controls)
        {
            var parent = field.Collection is null
                ? fields
                : fields[field.Collection]![0]!.AsObject();
            parent[field.Property] = new string('z', field.Limit);
        }
        using (var response = await Write(client, prepared.Route, fields, true, target == 0))
            Assert.Equal(
                target == 1 ? HttpStatusCode.NoContent : HttpStatusCode.Created,
                response.StatusCode
            );
        var route = prepared.Route;
        if (target == 0)
            await app.InDatabase(async db =>
                route =
                    $"/v2/applications/{(await db.CruiseApplications.SingleAsync(ct)).Id}/form-a"
            );
        using var read = JsonDocument.Parse(await Read(client, route));
        foreach (var field in controls)
        {
            var parent = field.Collection is null
                ? read.RootElement
                : read.RootElement.GetProperty(Camel(field.Collection))[0];
            if (field is { Collection: null, Property: "Note" })
                continue;
            Assert.Equal(
                new string('z', field.Limit),
                parent.GetProperty(Camel(field.Property)).GetString()
            );
        }
        // Check the actual persisted values independently from the HTTP reader/mapping.
        await app.InDatabase(async db =>
        {
            var contract = target is 0 or 1 or 3 ? await db.Contracts.SingleAsync(ct) : null;
            if (contract is not null)
                Assert.Equal(new string('z', 10240), contract.Description);
            if (target is 2 or 3)
            {
                Assert.Equal(new string('z', 1024), (await db.Ports.SingleAsync(ct)).Name);
                Assert.Equal(
                    new string('z', 1024),
                    (await db.CruiseDaysDetails.SingleAsync(ct)).Comment
                );
            }
            if (target == 3)
                Assert.Equal(
                    new string('z', 10240),
                    (await db.CollectedSamples.SingleAsync(ct)).Analysis
                );
            if (target == 2)
                Assert.Equal(
                    new string('z', 1024),
                    (await db.CrewMembers.SingleAsync(ct)).DocumentNumber
                );
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        foreach (var field in controls.Where(field => !field.Required))
        {
            var parent = field.Collection is null
                ? fields
                : fields[field.Collection]![0]!.AsObject();
            parent[field.Property] = null;
        }
        using (var response = await Write(client, route, fields, true))
            Assert.Equal(
                target is 0 or 1 ? HttpStatusCode.NoContent : HttpStatusCode.Created,
                response.StatusCode
            );
        using var nullableRead = JsonDocument.Parse(await Read(client, route));
        foreach (var field in controls.Where(field => !field.Required))
        {
            var parent = field.Collection is null
                ? nullableRead.RootElement
                : nullableRead.RootElement.GetProperty(Camel(field.Collection))[0];
            var value = parent.GetProperty(Camel(field.Property));
            if (field is { Collection: "ResearchAreaDescriptions", Property: "Info" })
                Assert.Equal("", value.GetString());
            else
                Assert.Equal(JsonValueKind.Null, value.ValueKind);
        }
        await app.Dispatch(ct);
        Assert.Empty(app.Transport.Messages);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(1)]
    [InlineData(2)]
    [InlineData(3)]
    public async Task Final_WhenStoredFieldsAreValid_SubmitsNormally(int target)
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var prepared = await Prepare(app, target);
        using var client = prepared.Client;
        using var response = await Write(
            client,
            prepared.Route,
            prepared.Fields,
            false,
            target == 0
        );
        Assert.True(
            response.StatusCode
                == (target == 1 ? HttpStatusCode.NoContent : HttpStatusCode.Created),
            await response.Content.ReadAsStringAsync(ct)
        );
        await app.InDatabase(async db =>
        {
            Assert.Equal(
                target is 0 or 1 ? CruiseApplicationStatus.WaitingForSupervisor
                    : target == 2 ? CruiseApplicationStatus.FormBFilled
                    : CruiseApplicationStatus.Reported,
                (await db.CruiseApplications.SingleAsync(ct)).Status
            );
            Assert.Equal(target is 0 or 1 ? 1 : 0, await db.EmailOutboxMessages.CountAsync(ct));
        });
        await app.Dispatch(ct);
        Assert.Equal(target is 0 or 1 ? 1 : 0, app.Transport.Messages.Count);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(2)]
    [InlineData(3)]
    public async Task Draft_WhenAllTextAndCollectionsAreEmpty_SavesAndReplaces(int target)
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var prepared = await Prepare(app, target);
        using var client = prepared.Client;
        var fields = (JsonObject)prepared.Fields.DeepClone();
        foreach (var property in fields.ToArray())
            if (property.Value is JsonArray)
                fields[property.Key] = new JsonArray();
            else if (
                property.Key is not "Id" and not "CruiseManagerId" and not "DeputyManagerId"
                && property.Value is JsonValue value
                && value.TryGetValue<string>(out _)
            )
                fields[property.Key] = "";
        if (target == 0)
        {
            fields["CruiseHours"] = "0";
            fields["PrecisePeriodStart"] = null;
            fields["PrecisePeriodEnd"] = null;
            fields["AcceptablePeriod"] = null;
            fields["OptimalPeriod"] = null;
        }
        using (var response = await Write(client, prepared.Route, fields, true, target == 0))
            Assert.True(
                response.StatusCode == HttpStatusCode.Created,
                await response.Content.ReadAsStringAsync(ct)
            );
        var route = prepared.Route;
        if (target == 0)
            await app.InDatabase(async db =>
                route =
                    $"/v2/applications/{(await db.CruiseApplications.SingleAsync(ct)).Id}/form-a"
            );
        using (var response = await Write(client, route, fields, true))
            Assert.Equal(
                target == 0 ? HttpStatusCode.NoContent : HttpStatusCode.Created,
                response.StatusCode
            );
        using var read = JsonDocument.Parse(await Read(client, route));
        foreach (var property in read.RootElement.EnumerateObject())
            if (property.Value.ValueKind == JsonValueKind.Array)
                Assert.Empty(property.Value.EnumerateArray());
        var required = Boundaries(target)
            .Where(field => field.Collection is null && field.Required);
        foreach (var field in required)
            Assert.Equal(
                target == 0 && field.Property == "CruiseHours" ? "0" : "",
                read.RootElement.GetProperty(Camel(field.Property)).GetString()
            );
        await app.InDatabase(async db =>
        {
            Assert.Equal(
                target == 0 ? CruiseApplicationStatus.Draft
                    : target == 2 ? CruiseApplicationStatus.FormBRequired
                    : CruiseApplicationStatus.Undertaken,
                (await db.CruiseApplications.SingleAsync(ct)).Status
            );
            Assert.Empty(await db.ResearchTasks.ToListAsync(ct));
            Assert.Empty(await db.ResearchEquipments.ToListAsync(ct));
            Assert.Empty(await db.CrewMembers.ToListAsync(ct));
            Assert.Empty(await db.CollectedSamples.ToListAsync(ct));
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        await app.Dispatch(ct);
        Assert.Empty(app.Transport.Messages);
    }

    private sealed record Boundary(
        string? Collection,
        string Property,
        bool Required,
        int Limit,
        bool FreeText
    );

    private static List<Boundary> Boundaries(int target)
    {
        static IEnumerable<Boundary> Fields(
            string? collection,
            bool required,
            int limit,
            bool text,
            params string[] properties
        ) =>
            properties.Select(property => new Boundary(
                collection,
                property,
                required,
                limit,
                text
            ));
        var fields = new List<Boundary>();
        fields.AddRange(Fields("UgTeams", true, 1024, false, "NoOfEmployees", "NoOfStudents"));
        fields.AddRange(Fields("GuestTeams", true, 1024, false, "NoOfPersons"));
        fields.AddRange(Fields("GuestTeams", false, 1024, true, "Name"));
        fields.AddRange(Fields("Permissions", false, 1024, true, "Executive"));
        fields.AddRange(Fields("Permissions", false, 1024, true, "Description"));
        if (target is 0 or 1 or 3)
        {
            fields.AddRange(Fields("Contracts", true, 1024, false, "Category"));
            fields.AddRange(
                Fields(
                    "Contracts",
                    false,
                    1024,
                    true,
                    "InstitutionName",
                    "InstitutionUnit",
                    "InstitutionLocalization"
                )
            );
            fields.AddRange(Fields("Contracts", false, 10240, true, "Description"));
            fields.AddRange(Fields("ResearchAreaDescriptions", false, 1024, true, "DifferentName"));
            fields.AddRange(Fields("ResearchAreaDescriptions", false, 10240, true, "Info"));
            fields.AddRange(Fields("SpubTasks", false, 1024, true, "Name", "YearFrom", "YearTo"));
            var tasks = target == 3 ? "ResearchTasksEffects" : "ResearchTasks";
            fields.AddRange(
                Fields(
                    tasks,
                    false,
                    1024,
                    true,
                    "Title",
                    "Magazine",
                    "Author",
                    "Institution",
                    "Date",
                    "StartDate",
                    "EndDate"
                )
            );
            fields.AddRange(
                Fields(
                    tasks,
                    false,
                    1024,
                    false,
                    "FinancingAmount",
                    "FinancingApproved",
                    "SecuredAmount",
                    "MinisterialPoints"
                )
            );
            fields.AddRange(Fields(tasks, false, 10240, true, "Description"));
        }
        if (target is 0 or 1)
        {
            fields.AddRange(Fields(null, true, 4, false, "Year"));
            fields.AddRange(Fields(null, true, 8, false, "CruiseHours"));
            fields.AddRange(Fields(null, true, 1024, false, "SupervisorEmail"));
            fields.AddRange(Fields(null, true, 1024, true, "PeriodNotes", "DifferentUsage"));
            fields.AddRange(Fields(null, true, 10240, true, "CruiseGoalDescription"));
            fields.AddRange(Fields(null, false, 16, false, "PeriodSelectionType"));
            fields.AddRange(Fields(null, false, 1, false, "ShipUsage"));
            fields.AddRange(Fields(null, false, 1024, true, "Note"));
            fields.AddRange(Fields(null, false, 10240, false, "CruiseGoal"));
            fields.AddRange(
                Fields("Publications", true, 1024, false, "Category", "MinisterialPoints")
            );
            fields.AddRange(
                Fields(
                    "Publications",
                    false,
                    1024,
                    true,
                    "Doi",
                    "Authors",
                    "Title",
                    "Magazine",
                    "Year"
                )
            );
        }
        else
        {
            fields.AddRange(
                Fields("ShortResearchEquipments", true, 1024, true, "Name", "StartDate", "EndDate")
            );
            fields.AddRange(Fields("LongResearchEquipments", true, 1024, true, "Name", "Duration"));
            fields.AddRange(Fields("ResearchEquipments", true, 1024, true, "Name", "Permission"));
            fields.AddRange(
                Fields(
                    "ResearchEquipments",
                    false,
                    1024,
                    true,
                    "InsuranceStartDate",
                    "InsuranceEndDate"
                )
            );
            fields.AddRange(Fields("Ports", true, 1024, true, "Name", "StartTime", "EndTime"));
            fields.AddRange(
                Fields(
                    "CruiseDaysDetails",
                    true,
                    1024,
                    true,
                    "Number",
                    "Hours",
                    "TaskName",
                    "Region",
                    "Position",
                    "Comment"
                )
            );
            if (target == 2)
            {
                fields.AddRange(Fields(null, true, 1024, true, "IsCruiseManagerPresent"));
                fields.AddRange(
                    Fields(
                        "CrewMembers",
                        true,
                        1024,
                        true,
                        "Title",
                        "FirstName",
                        "LastName",
                        "BirthPlace",
                        "BirthDate",
                        "DocumentNumber",
                        "DocumentExpiryDate",
                        "Institution"
                    )
                );
            }
            else
            {
                fields.AddRange(Fields(null, true, 1, false, "ShipUsage"));
                fields.AddRange(Fields(null, true, 1024, true, "DifferentUsage"));
                fields.AddRange(
                    Fields(null, false, 10240, true, "SpubReportData", "AdditionalDescription")
                );
                fields.AddRange(
                    Fields(
                        "CollectedSamples",
                        true,
                        10240,
                        true,
                        "Type",
                        "Amount",
                        "Analysis",
                        "Publishing"
                    )
                );
                fields.AddRange(
                    Fields(
                        "ResearchTasksEffects",
                        true,
                        1024,
                        false,
                        "Done",
                        "ManagerConditionMet",
                        "DeputyConditionMet"
                    )
                );
                fields.AddRange(
                    Fields(
                        "ResearchTasksEffects",
                        false,
                        1024,
                        false,
                        "PublicationMinisterialPoints"
                    )
                );
            }
        }
        return fields;
    }

    private static async Task<(HttpClient Client, JsonObject Fields, string Route)> Prepare(
        TestApplication app,
        int target
    )
    {
        var ct = TestContext.Current.CancellationToken;
        const string email = "field-owner@example.invalid";
        Guid id = default;
        var unit = new UgUnit { Name = "Field faculty", IsActive = true };
        await app.InDatabase(async db =>
        {
            db.UgUnits.Add(unit);
            await db.SaveChangesAsync(ct);
        });
        JsonObject fields;
        if (target is 0 or 1)
        {
            var owner = await TestUsers.Create(app, email, RoleName.CruiseManager);
            var deputy = await TestUsers.Create(
                app,
                "field-deputy@example.invalid",
                RoleName.CruiseManager
            );
            fields = JsonSerializer
                .SerializeToNode(
                    FormAWorkflowTests.CompleteForm(
                        Guid.Parse(owner.Id),
                        Guid.Parse(deputy.Id),
                        unit.Id
                    )
                )!
                .AsObject();
        }
        else
        {
            id = (
                await TestApplications.Create(
                    app,
                    target == 2
                        ? CruiseApplicationStatus.FormBRequired
                        : CruiseApplicationStatus.Undertaken,
                    email
                )
            ).Id;
            fields =
                target == 2
                    ? new JsonObject { ["IsCruiseManagerPresent"] = "true" }
                    : new JsonObject { ["ShipUsage"] = "0", ["DifferentUsage"] = "" };
            fields["UgTeams"] = new JsonArray(
                new JsonObject
                {
                    ["UgUnitId"] = unit.Id,
                    ["NoOfEmployees"] = "2",
                    ["NoOfStudents"] = "0",
                }
            );
        }
        // Populate every exercised child with values valid for the existing final rules.
        foreach (
            var group in Boundaries(target)
                .Where(field => field.Collection is not null)
                .GroupBy(field => field.Collection!)
        )
        {
            if (fields[group.Key] is null || fields[group.Key]!.AsArray().Count == 0)
                fields[group.Key] = new JsonArray(new JsonObject());
            var item = fields[group.Key]![0]!.AsObject();
            foreach (var field in group)
                if (item[field.Property] is null)
                    item[field.Property] = field.Required ? "0" : "Synthetic detail";
        }
        fields["GuestTeams"]![0]!["NoOfPersons"] = "1";
        if (target is 0 or 1 or 3)
        {
            fields["Contracts"]![0]!["Category"] = ContractCategory.Domestic;
            fields["SpubTasks"]![0]!["YearFrom"] = "2029";
            fields["SpubTasks"]![0]!["YearTo"] = "2030";
            var task = fields[target == 3 ? "ResearchTasksEffects" : "ResearchTasks"]![0]!;
            task["Type"] = "0";
            task["FinancingAmount"] = "1";
            task["FinancingApproved"] = "true";
            task["SecuredAmount"] = "1";
            task["MinisterialPoints"] = "1";
            if (target == 3)
            {
                task["Done"] = "false";
                task["ManagerConditionMet"] = "false";
                task["DeputyConditionMet"] = "false";
                task["PublicationMinisterialPoints"] = "0";
            }
        }
        if (target is 0 or 1)
            fields["Publications"]![0]!["Category"] = PublicationCategory.Subject;
        if (target is 2 or 3)
            fields["LongResearchEquipments"]![0]!["Action"] = "Put";
        // No permission scan is required in A; B/C final mode needs a valid PDF.
        if (target is 2 or 3)
            fields["Permissions"]![0]!["Scan"] = new JsonObject
            {
                ["Name"] = "permission.pdf",
                ["Content"] = Convert.ToBase64String("%PDF-1.7\nsynthetic"u8.ToArray()),
            };
        var client = await TestApplications.Login(app, email);
        try
        {
            if (target == 1)
            {
                using var saved = await Write(
                    client,
                    "/v2/applications",
                    fields,
                    true,
                    create: true
                );
                Assert.Equal(HttpStatusCode.Created, saved.StatusCode);
                await app.InDatabase(async db =>
                    id = (await db.CruiseApplications.SingleAsync(ct)).Id
                );
            }
            var route =
                target == 0
                    ? "/v2/applications"
                    : $"/v2/applications/{id}/form-{(target == 1 ? "a" : target == 2 ? "b" : "c")}";
            if (target is 2 or 3)
            {
                using var saved = await Write(client, route, fields, true, target == 0);
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

    private static string Camel(string property) =>
        JsonNamingPolicy.CamelCase.ConvertName(property);
}
