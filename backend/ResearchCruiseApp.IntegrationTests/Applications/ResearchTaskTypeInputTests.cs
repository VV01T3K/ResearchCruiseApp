using System.Globalization;
using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.IntegrationTests.Infrastructure;
using static ResearchCruiseApp.IntegrationTests.Infrastructure.FormRequests;

namespace ResearchCruiseApp.IntegrationTests.Applications;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class ResearchTaskTypeInputTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    // BE-TASK-TYPE-001: reject unsupported enum values before mapping/scoring/replacement.
    // Drafts only: final submission runs the same rule, so repeating it adds runtime, not coverage.
    [Theory]
    [InlineData(0, 0)]
    [InlineData(0, 1)]
    [InlineData(0, 2)]
    [InlineData(0, 3)]
    [InlineData(1, 0)]
    [InlineData(1, 1)]
    [InlineData(1, 2)]
    [InlineData(1, 3)]
    [InlineData(2, 0)]
    [InlineData(2, 1)]
    [InlineData(2, 2)]
    [InlineData(2, 3)]
    public async Task Write_WhenTaskTypeIsUnsupported_RejectsAndPreservesSavedState(
        int target,
        int family
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var prepared = await Prepare(app, target);
        using var client = prepared.Client;
        var original = await Snapshot(app);
        var originalHttp = target == 0 ? null : await Read(client, prepared.Route);
        string?[] values = family switch
        {
            0 => ["2147483648", "-2147483649"],
            1 => ["12", "-1"],
            2 => ["not-a-task", "", "bachelorthesis"],
            _ => [null, null],
        };
        for (var index = 0; index < values.Length; index++)
        {
            var fields = (JsonObject)prepared.Fields.DeepClone();
            var task = fields[prepared.Collection]![1]!.AsObject();
            if (family == 3 && index == 1)
                task.Remove("Type");
            else
                task["Type"] = values[index];
            using var response = await Write(client, prepared.Route, fields, true, target == 0);
            Assert.True(
                response.StatusCode == HttpStatusCode.BadRequest,
                $"target={target}, family={family}, type={values[index] ?? "null"}: HTTP {(int)response.StatusCode}"
            );
            Assert.Equal(
                "application/problem+json",
                response.Content.Headers.ContentType?.MediaType
            );
            using var problem = JsonDocument.Parse(await response.Content.ReadAsStringAsync(ct));
            var path =
                $"form.{JsonNamingPolicy.CamelCase.ConvertName(prepared.Collection)}[1].type";
            Assert.True(
                problem.RootElement.GetProperty("errors").TryGetProperty(path, out var errors),
                $"HTTP 400 lacks {path}: {problem.RootElement}"
            );
            Assert.NotEmpty(errors.EnumerateArray());
            Assert.Equal(original, await Snapshot(app));
            if (target != 0)
                Assert.Equal(originalHttp, await Read(client, prepared.Route));
        }
        await app.Dispatch(ct);
        Assert.Empty(app.Transport.Messages);
    }

    // BE-TASK-TYPE-002: preserve all declared types and existing Enum.Parse representations.
    [Theory]
    [InlineData(0, true)]
    [InlineData(0, false)]
    [InlineData(1, true)]
    [InlineData(1, false)]
    [InlineData(2, true)]
    [InlineData(2, false)]
    public async Task Write_WhenTaskTypesAreSupported_RoundTripsDeclaredTypesAndSubmission(
        int target,
        bool draft
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var prepared = await Prepare(app, target);
        using var client = prepared.Client;
        var inputs = Enumerable
            .Range(0, 12)
            .Select(value => value.ToString(CultureInfo.InvariantCulture))
            .Concat(["BachelorThesis", " 11 ", "BachelorThesis, MasterThesis"])
            .ToArray();
        var expected = Enumerable.Range(0, 12).Concat([0, 11, 1]).ToArray();
        prepared.Fields[prepared.Collection] = new JsonArray(
            inputs.Select((type, index) => (JsonNode)TaskFields(type, index)).ToArray()
        );
        using var response = await Write(
            client,
            prepared.Route,
            prepared.Fields,
            draft,
            target == 0
        );
        Assert.Equal(
            target == 1 ? HttpStatusCode.NoContent : HttpStatusCode.Created,
            response.StatusCode
        );
        Guid id = default;
        await app.InDatabase(async db => id = (await db.CruiseApplications.SingleAsync(ct)).Id);
        var route = target == 0 ? $"/v2/applications/{id}/form-a" : prepared.Route;
        using var read = JsonDocument.Parse(await Read(client, route));
        var tasks = read.RootElement.GetProperty(
            target == 2 ? "researchTasksEffects" : "researchTasks"
        );
        Assert.Equal(
            expected.Order(),
            tasks
                .EnumerateArray()
                .Select(task =>
                    int.Parse(task.GetProperty("type").GetString()!, CultureInfo.InvariantCulture)
                )
                .Order()
        );
        await app.InDatabase(async db =>
        {
            Assert.Equal(
                expected.Order(),
                (await db.ResearchTasks.Select(row => (int)row.Type).ToArrayAsync(ct)).Order()
            );
            var application = await db.CruiseApplications.SingleAsync(ct);
            Assert.Equal(
                target == 2
                    ? (
                        draft
                            ? CruiseApplicationStatus.Undertaken
                            : CruiseApplicationStatus.Reported
                    )
                    : (
                        draft
                            ? CruiseApplicationStatus.Draft
                            : CruiseApplicationStatus.WaitingForSupervisor
                    ),
                application.Status
            );
            Assert.Equal(
                target != 2 && !draft ? 1 : 0,
                await db.EmailOutboxMessages.CountAsync(ct)
            );
            if (draft)
                Assert.Empty(await db.UserEffects.ToListAsync(ct));
        });
        await app.Dispatch(ct);
        Assert.Equal(target != 2 && !draft ? 1 : 0, app.Transport.Messages.Count);
    }

    private static JsonObject TaskFields(string type, int index) =>
        new()
        {
            ["Type"] = type,
            ["Title"] = $"Synthetic task {index}",
            ["Author"] = "Synthetic author",
            ["Description"] = "Synthetic task",
            ["Date"] = "2030-01-01",
            ["StartDate"] = "2030-01-01",
            ["EndDate"] = "2030-02-01",
            ["Magazine"] = "Synthetic journal",
            ["FinancingApproved"] = "false",
            ["FinancingAmount"] = "0",
            ["SecuredAmount"] = "0",
            ["MinisterialPoints"] = "0",
            ["Done"] = "false",
            ["ManagerConditionMet"] = "false",
            ["DeputyConditionMet"] = "false",
        };

    private static async Task<(
        HttpClient Client,
        JsonObject Fields,
        string Route,
        string Collection
    )> Prepare(TestApplication app, int target)
    {
        var ct = TestContext.Current.CancellationToken;
        const string email = "task-type-owner@example.invalid";
        Guid id = default;
        JsonObject fields;
        if (target == 2)
        {
            id = (await TestApplications.Create(app, CruiseApplicationStatus.Undertaken, email)).Id;
            fields = new JsonObject { ["ShipUsage"] = "0", ["DifferentUsage"] = "" };
        }
        else
        {
            var owner = await TestUsers.Create(app, email, RoleName.CruiseManager);
            var deputy = await TestUsers.Create(
                app,
                "task-type-deputy@example.invalid",
                RoleName.CruiseManager
            );
            var unit = new UgUnit { Name = "Task faculty", IsActive = true };
            await app.InDatabase(async db =>
            {
                db.UgUnits.Add(unit);
                await db.SaveChangesAsync(ct);
            });
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
        var collection = target == 2 ? "ResearchTasksEffects" : "ResearchTasks";
        fields[collection] = new JsonArray(TaskFields("0", 0), TaskFields("11", 1));
        fields["Note"] = "Original task type draft";
        var client = await TestApplications.Login(app, email);
        try
        {
            if (target == 1)
            {
                using var response = await Write(
                    client,
                    "/v2/applications",
                    fields,
                    true,
                    create: true
                );
                Assert.Equal(HttpStatusCode.Created, response.StatusCode);
                await app.InDatabase(async db =>
                    id = (await db.CruiseApplications.SingleAsync(ct)).Id
                );
            }
            var route =
                target == 0
                    ? "/v2/applications"
                    : $"/v2/applications/{id}/form-{(target == 1 ? "a" : "c")}";
            if (target == 2)
            {
                using var response = await Write(client, route, fields, true, target == 0);
                Assert.Equal(HttpStatusCode.Created, response.StatusCode);
            }
            return (client, fields, route, collection);
        }
        catch
        {
            client.Dispose();
            throw;
        }
    }
}
