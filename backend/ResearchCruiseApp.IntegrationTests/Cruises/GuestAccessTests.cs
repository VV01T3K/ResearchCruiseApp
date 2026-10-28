using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Identity;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Cruises;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class GuestAccessTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    [Fact]
    public async Task Read_WhenGuest_ShowsCruiseWithoutApplications()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var application = await TestApplications.Create(app, CruiseApplicationStatus.Undertaken);
        var guest = await TestUsers.Create(app, "guest@example.invalid", RoleName.Guest);
        var cruise = new Cruise
        {
            Number = "2030/1",
            StartDate = "2030-06-01T08:00:00.000Z",
            EndDate = "2030-06-02T08:00:00.000Z",
            Status = CruiseStatus.Confirmed,
            Title = "Guest fixture",
        };
        await app.InDatabase(async db =>
        {
            var row = await db.CruiseApplications.Include(row => row.FormA).SingleAsync(ct);
            cruise.MainCruiseManagerId = row.FormA!.CruiseManagerId;
            cruise.CruiseApplications = [row];
            db.Cruises.Add(cruise);
            await db.SaveChangesAsync(ct);
        });
        // Token issued before the downgrade must not keep manager access.
        using var formerManager = await TestApplications.Login(app, application.OwnerEmail);
        await using (var scope = app.Services.CreateAsyncScope())
        {
            var users = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            var owner = await users.FindByEmailAsync(application.OwnerEmail);
            await users.RemoveFromRoleAsync(owner!, RoleName.CruiseManager);
            await users.AddToRoleAsync(owner!, RoleName.Guest);
        }
        using var client = await TestApplications.Login(app, guest.Email!);

        foreach (var reader in new[] { client, formerManager })
            await AssertGuestAccess(reader, cruise, application.Id, ct);
    }

    private static async Task AssertGuestAccess(
        HttpClient client,
        Cruise cruise,
        Guid applicationId,
        CancellationToken ct
    )
    {
        foreach (var route in new[] { "/v2/cruises", $"/v2/cruises/{cruise.Id}" })
        {
            using var body = JsonDocument.Parse(await client.GetStringAsync(route, ct));
            var item =
                body.RootElement.ValueKind == JsonValueKind.Array
                    ? Assert.Single(body.RootElement.EnumerateArray())
                    : body.RootElement;
            Assert.Equal("Guest fixture", item.GetProperty("title").GetString());
            Assert.Equal(
                cruise.MainCruiseManagerId,
                item.GetProperty("mainManager").GetProperty("id").GetGuid()
            );
            Assert.Equal(0, item.GetProperty("applications").GetArrayLength());
        }
        using var list = JsonDocument.Parse(await client.GetStringAsync("/v2/applications", ct));
        Assert.Equal(0, list.RootElement.GetProperty("items").GetArrayLength());
        foreach (var suffix in new[] { "", "/form-a", "/evaluation", "/cruise" })
        {
            using var response = await client.GetAsync(
                $"/v2/applications/{applicationId}{suffix}",
                ct
            );
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }
        foreach (
            var route in new[] { "/v2/applications/form-a/context", "/v2/users/me/cruise-effects" }
        )
        {
            using var response = await client.GetAsync(route, ct);
            Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
        }
    }
}
