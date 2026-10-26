using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.IntegrationTests.Infrastructure;
using static ResearchCruiseApp.IntegrationTests.Infrastructure.FormRequests;

namespace ResearchCruiseApp.IntegrationTests.Applications;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class ResearchEquipmentActionInputTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

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
        string[] inputs = ["Put", "Collect", "0", "1", " 1 "];
        string[] expected = ["Put", "Collect", "Put", "Collect", "Collect"];
        using var response = await Write(client, route, Fields(form, inputs), draft);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
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

    [Theory]
    [InlineData("b", "2147483648")]
    [InlineData("c", "bogus")]
    [InlineData("c", "2")]
    [InlineData("b", "Put, Collect")]
    public async Task Write_WhenActionIsInvalid_ReturnsBadRequest(string form, string action)
    {
        await using var app = new TestApplication(fixture.ConnectionString);
        var application = await TestApplications.Create(app, EditableStatus(form));
        using var client = await TestApplications.Login(app, application.OwnerEmail);
        var route = $"/v2/applications/{application.Id}/form-{form}";
        using var response = await Write(client, route, Fields(form, [action]), draft: true);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
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
}
