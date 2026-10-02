using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Cruises;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class CruiseStorageTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    // BE-CRUISE-011: both date columns have a 64-character SQL limit; existing date formats remain unchanged.
    [Theory]
    [InlineData(false, "StartDate", false)]
    [InlineData(false, "StartDate", true)]
    [InlineData(false, "EndDate", false)]
    [InlineData(false, "EndDate", true)]
    [InlineData(true, "StartDate", false)]
    [InlineData(true, "StartDate", true)]
    [InlineData(true, "EndDate", false)]
    [InlineData(true, "EndDate", true)]
    public async Task Write_WhenDateReachesStorageBoundary_PersistsLimitAndRejectsOverflow(
        bool update,
        string field,
        bool oversized
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var application = await TestApplications.Create(app, CruiseApplicationStatus.Accepted);
        var original = new Cruise
        {
            Number = "2030/1",
            StartDate = "2030-06-01",
            EndDate = "2030-06-02",
            Status = CruiseStatus.New,
            Title = "Original",
            CruiseApplications = [],
        };
        await app.InDatabase(async db =>
        {
            original.CruiseApplications.Add(
                await db.CruiseApplications.SingleAsync(row => row.Id == application.Id, ct)
            );
            db.Cruises.Add(original);
            await db.SaveChangesAsync(ct);
        });
        await TestUsers.Create(app, "office@example.invalid", RoleName.Administrator);
        using var client = await TestApplications.Login(app, "office@example.invalid");
        using var before = await client.GetAsync($"/v2/cruises/{original.Id}", ct);
        Assert.Equal(HttpStatusCode.OK, before.StatusCode);
        var beforeJson = await before.Content.ReadAsStringAsync(ct);
        var start = "2030-07-01";
        var end = "2030-07-02";
        if (field == "StartDate")
            start = start.PadRight(oversized ? 65 : 64);
        else
            end = end.PadRight(oversized ? 65 : 64);
        var body = new
        {
            StartDate = start,
            EndDate = end,
            MainManagerId = Guid.Empty,
            DeputyManagerId = Guid.Empty,
            CruiseApplicationIds = new[] { application.Id },
            Title = "Boundary",
            ShipUnavailable = false,
        };
        using var response = update
            ? await client.PatchAsJsonAsync($"/v2/cruises/{original.Id}", body, ct)
            : await client.PostAsJsonAsync("/v2/cruises", body, ct);
        Assert.Equal(
            oversized ? HttpStatusCode.BadRequest
                : update ? HttpStatusCode.NoContent
                : HttpStatusCode.Created,
            response.StatusCode
        );
        if (oversized)
        {
            Assert.Equal(
                "application/problem+json",
                response.Content.Headers.ContentType?.MediaType
            );
            using var problem = JsonDocument.Parse(await response.Content.ReadAsStringAsync(ct));
            var error = Assert.Single(problem.RootElement.GetProperty("errors").EnumerateObject());
            Assert.Equal(field, error.Name);
            Assert.NotEmpty(error.Value.EnumerateArray());
            using var after = await client.GetAsync($"/v2/cruises/{original.Id}", ct);
            Assert.Equal(HttpStatusCode.OK, after.StatusCode);
            Assert.Equal(beforeJson, await after.Content.ReadAsStringAsync(ct));
        }
        Guid savedId = Guid.Empty;
        await app.InDatabase(async db =>
        {
            var cruises = await db.Cruises.Include(row => row.CruiseApplications).ToListAsync(ct);
            Assert.Equal(oversized || update ? 1 : 2, cruises.Count);
            var saved = Assert.Single(
                cruises,
                row => row.Title == (oversized ? "Original" : "Boundary")
            );
            savedId = saved.Id;
            if (oversized || update)
                Assert.Equal(original.Id, saved.Id);
            else
                Assert.NotEqual(original.Id, saved.Id);
            Assert.Equal(oversized ? original.StartDate : start, saved.StartDate);
            Assert.Equal(oversized ? original.EndDate : end, saved.EndDate);
            Assert.Equal(CruiseStatus.New, saved.Status);
            Assert.Equal(Guid.Empty, saved.MainCruiseManagerId);
            Assert.Equal(Guid.Empty, saved.MainDeputyManagerId);
            var assigned = Assert.Single(saved.CruiseApplications);
            Assert.Equal(application.Id, assigned.Id);
            Assert.Equal(CruiseApplicationStatus.Accepted, assigned.Status);
            if (!update && !oversized)
            {
                var previous = Assert.Single(cruises, row => row.Id == original.Id);
                Assert.Empty(previous.CruiseApplications);
                Assert.Equal("2030/1", previous.Number);
                Assert.Equal("Original", previous.Title);
                Assert.Equal(original.StartDate, previous.StartDate);
                Assert.Equal(original.EndDate, previous.EndDate);
            }
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        if (!oversized)
        {
            using var read = await client.GetAsync($"/v2/cruises/{savedId}", ct);
            Assert.Equal(HttpStatusCode.OK, read.StatusCode);
            using var json = JsonDocument.Parse(await read.Content.ReadAsStringAsync(ct));
            Assert.Equal(start, json.RootElement.GetProperty("startDate").GetString());
            Assert.Equal(end, json.RootElement.GetProperty("endDate").GetString());
        }
        await app.Dispatch(ct);
        Assert.Empty(app.Transport.Messages);
    }
}
