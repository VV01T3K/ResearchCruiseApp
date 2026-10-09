using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Applications;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class ResearchEquipmentActionInputTests(SqlFixture fixture) : IAsyncLifetime
{
    private static readonly string[] DefaultActions = ["Put", "Collect"];

    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    // BE-EQUIPMENT-ACTION-001: reject before resolving equipment or replacing saved links.
    [Theory]
    [InlineData("b", true, 0)]
    [InlineData("b", true, 1)]
    [InlineData("b", true, 2)]
    [InlineData("b", true, 3)]
    [InlineData("b", false, 0)]
    [InlineData("b", false, 1)]
    [InlineData("b", false, 2)]
    [InlineData("b", false, 3)]
    [InlineData("c", true, 0)]
    [InlineData("c", true, 1)]
    [InlineData("c", true, 2)]
    [InlineData("c", true, 3)]
    [InlineData("c", false, 0)]
    [InlineData("c", false, 1)]
    [InlineData("c", false, 2)]
    [InlineData("c", false, 3)]
    public async Task Write_WhenActionIsUnsupported_RejectsCreationAndReplacement(
        string form,
        bool draft,
        int family
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var application = await TestApplications.Create(app, EditableStatus(form));
        using var client = await TestApplications.Login(app, application.OwnerEmail);
        var route = $"/v2/applications/{application.Id}/form-{form}";
        string?[] values = family switch
        {
            0 => ["2147483648", "-2147483649"],
            1 => ["2", "-1"],
            2 => ["not-an-action", "", "put"],
            _ => [null, null],
        };
        foreach (var saved in new[] { false, true })
        {
            if (saved)
            {
                using var control = await Write(client, route, Fields(form, DefaultActions), true);
                Assert.Equal(HttpStatusCode.Created, control.StatusCode);
            }
            var original = await Snapshot(app);
            var originalHttp = saved ? await Read(client, route) : null;
            for (var index = 0; index < values.Length; index++)
            {
                var fields = Fields(form, DefaultActions);
                var equipment = fields["LongResearchEquipments"]![1]!.AsObject();
                equipment["Name"] = "Rejected replacement equipment";
                equipment["Duration"] = "99";
                if (family == 3 && index == 1)
                    equipment.Remove("Action");
                else
                    equipment["Action"] = values[index];
                using var response = await Write(client, route, fields, draft);
                Assert.True(
                    response.StatusCode == HttpStatusCode.BadRequest,
                    $"form={form}, draft={draft}, saved={saved}, family={family}, action={values[index] ?? "null"}: HTTP {(int)response.StatusCode}"
                );
                Assert.Equal(
                    "application/problem+json",
                    response.Content.Headers.ContentType?.MediaType
                );
                using var problem = JsonDocument.Parse(
                    await response.Content.ReadAsStringAsync(ct)
                );
                const string path = "form.longResearchEquipments[1].action";
                Assert.True(
                    problem.RootElement.GetProperty("errors").TryGetProperty(path, out var errors),
                    $"HTTP 400 lacks {path}: {problem.RootElement}"
                );
                Assert.NotEmpty(errors.EnumerateArray());
                Assert.Equal(original, await Snapshot(app));
                if (saved)
                    Assert.Equal(originalHttp, await Read(client, route));
                else
                {
                    using var absent = await client.GetAsync(route, ct);
                    Assert.Equal(HttpStatusCode.NotFound, absent.StatusCode);
                }
            }
        }
        await app.Dispatch(ct);
        Assert.Empty(app.Transport.Messages);
    }

    // BE-EQUIPMENT-ACTION-002: retain named, numeric, whitespace and comma parser compatibility.
    [Theory]
    [InlineData("b", true)]
    [InlineData("b", false)]
    [InlineData("c", true)]
    [InlineData("c", false)]
    public async Task Write_WhenActionsAreSupported_RoundTripsExistingRepresentations(
        string form,
        bool draft
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var application = await TestApplications.Create(app, EditableStatus(form));
        using var client = await TestApplications.Login(app, application.OwnerEmail);
        var route = $"/v2/applications/{application.Id}/form-{form}";
        string[] inputs = ["Put", "Collect", "0", "1", " 1 ", "Put, Collect"];
        string[] expected = ["Put", "Collect", "Put", "Collect", "Collect", "Collect"];
        using var response = await Write(client, route, Fields(form, inputs), draft);
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        using var read = JsonDocument.Parse(await Read(client, route));
        var equipment = read
            .RootElement.GetProperty("longResearchEquipments")
            .EnumerateArray()
            .ToArray();
        Assert.Equal(inputs.Length, equipment.Length);
        for (var index = 0; index < expected.Length; index++)
        {
            var item = Assert.Single(
                equipment,
                item => item.GetProperty("name").GetString() == $"Equipment {index}"
            );
            Assert.Equal(expected[index], item.GetProperty("action").GetString());
            Assert.Equal("12", item.GetProperty("duration").GetString());
        }
        await app.InDatabase(async db =>
        {
            var links =
                form == "b"
                    ? await db
                        .FormBLongResearchEquipments.Select(link => new
                        {
                            link.ResearchEquipment.Name,
                            link.Action,
                            link.Duration,
                        })
                        .ToArrayAsync(ct)
                    : await db
                        .FormCLongResearchEquipments.Select(link => new
                        {
                            link.ResearchEquipment.Name,
                            link.Action,
                            link.Duration,
                        })
                        .ToArrayAsync(ct);
            Assert.Equal(expected.Length, links.Length);
            Assert.Equal(expected.Length, await db.ResearchEquipments.CountAsync(ct));
            for (var index = 0; index < expected.Length; index++)
            {
                var link = Assert.Single(links, link => link.Name == $"Equipment {index}");
                Assert.Equal(expected[index], link.Action.ToString());
                Assert.Equal("12", link.Duration);
            }
            Assert.Equal(form == "b" ? 1 : 0, await db.FormsB.CountAsync(ct));
            Assert.Equal(form == "c" ? 1 : 0, await db.FormsC.CountAsync(ct));
            Assert.Equal(
                draft ? EditableStatus(form)
                    : form == "b" ? CruiseApplicationStatus.FormBFilled
                    : CruiseApplicationStatus.Reported,
                (await db.CruiseApplications.SingleAsync(ct)).Status
            );
            Assert.Empty(await db.UserEffects.ToListAsync(ct));
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        await app.Dispatch(ct);
        Assert.Empty(app.Transport.Messages);
    }

    private static CruiseApplicationStatus EditableStatus(string form) =>
        form == "b" ? CruiseApplicationStatus.FormBRequired : CruiseApplicationStatus.Undertaken;

    private static JsonObject Fields(string form, string[] actions)
    {
        var fields =
            form == "b"
                ? new JsonObject { ["IsCruiseManagerPresent"] = "true" }
                : new JsonObject { ["ShipUsage"] = "0", ["DifferentUsage"] = "" };
        fields["LongResearchEquipments"] = new JsonArray(
            actions
                .Select(
                    (action, index) =>
                        (JsonNode)
                            new JsonObject
                            {
                                ["Name"] = $"Equipment {index}",
                                ["Action"] = action,
                                ["Duration"] = "12",
                            }
                )
                .ToArray()
        );
        return fields;
    }

    private static Task<HttpResponseMessage> Write(
        HttpClient client,
        string route,
        JsonObject fields,
        bool draft
    ) =>
        client.PutAsJsonAsync(
            route,
            new { Form = fields, Draft = draft },
            TestContext.Current.CancellationToken
        );

    private static async Task<string> Read(HttpClient client, string route)
    {
        using var response = await client.GetAsync(route, TestContext.Current.CancellationToken);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        return await response.Content.ReadAsStringAsync(TestContext.Current.CancellationToken);
    }

    private static async Task<string> Snapshot(TestApplication app)
    {
        var ct = TestContext.Current.CancellationToken;
        string snapshot = "";
        await app.InDatabase(async db =>
        {
            Assert.Empty(await db.UserEffects.ToListAsync(ct));
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
            snapshot = JsonSerializer.Serialize(
                new
                {
                    Applications = await db
                        .CruiseApplications.Select(row => new
                        {
                            row.Id,
                            row.Status,
                            row.Number,
                            row.Date,
                            row.Note,
                            row.EffectsPoints,
                            row.SupervisorCode,
                            FormAId = row.FormA!.Id,
                            row.FormA.CruiseManagerId,
                            row.FormA.DeputyManagerId,
                        })
                        .ToArrayAsync(ct),
                    FormsB = await db
                        .FormsB.Select(row => new { row.Id, row.IsCruiseManagerPresent })
                        .ToArrayAsync(ct),
                    FormsC = await db
                        .FormsC.Select(row => new
                        {
                            row.Id,
                            row.ShipUsage,
                            row.DifferentUsage,
                        })
                        .ToArrayAsync(ct),
                    Equipment = await db
                        .ResearchEquipments.OrderBy(row => row.Id)
                        .Select(row => new { row.Id, row.Name })
                        .ToArrayAsync(ct),
                    BLinks = await db
                        .FormBLongResearchEquipments.OrderBy(row => row.Id)
                        .Select(row => new
                        {
                            row.Id,
                            FormId = row.FormB.Id,
                            EquipmentId = row.ResearchEquipment.Id,
                            row.Action,
                            row.Duration,
                        })
                        .ToArrayAsync(ct),
                    CLinks = await db
                        .FormCLongResearchEquipments.OrderBy(row => row.Id)
                        .Select(row => new
                        {
                            row.Id,
                            FormId = row.FormC.Id,
                            EquipmentId = row.ResearchEquipment.Id,
                            row.Action,
                            row.Duration,
                        })
                        .ToArrayAsync(ct),
                }
            );
        });
        return snapshot;
    }
}
