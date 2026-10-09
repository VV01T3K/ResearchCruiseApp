using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Users;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Auth;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class AccountAccessTests(SqlFixture fixture) : IAsyncLifetime
{
    private static readonly string[] PublicUserProperties =
    [
        "accepted",
        "email",
        "emailConfirmed",
        "firstName",
        "id",
        "lastName",
        "roles",
    ];

    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    [Theory]
    [InlineData("anonymous", HttpStatusCode.Unauthorized)]
    [InlineData(RoleName.Guest, HttpStatusCode.Forbidden)]
    [InlineData(RoleName.ShipCrew, HttpStatusCode.Forbidden)]
    [InlineData(RoleName.CruiseManager, HttpStatusCode.Forbidden)]
    [InlineData(RoleName.Shipowner, HttpStatusCode.OK)]
    [InlineData(RoleName.Administrator, HttpStatusCode.OK)]
    public async Task List_WhenActorRequestsAccounts_EnforcesRolesWithoutChangingAccounts(
        string actorRole,
        HttpStatusCode expected
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var ids = new Dictionary<string, Guid>();
        foreach (
            var role in new[]
            {
                RoleName.Administrator,
                RoleName.Shipowner,
                RoleName.CruiseManager,
                RoleName.ShipCrew,
                RoleName.Guest,
            }
        )
        {
            var user = await TestUsers.Create(app, role + "@example.invalid", role);
            ids.Add(role, Guid.Parse(user.Id));
        }
        var pending = await TestUsers.Create(
            app,
            "pending@example.invalid",
            RoleName.CruiseManager
        );
        await app.InDatabase(async db =>
        {
            (await db.Users.SingleAsync(row => row.Id == pending.Id, ct)).Accepted = false;
            await db.SaveChangesAsync(ct);
        });
        using var client =
            actorRole == "anonymous"
                ? app.CreateApiClient()
                : await TestApplications.Login(app, actorRole + "@example.invalid");
        var original = await Snapshot(app);
        using var usersResponse = await client.GetAsync("/v2/users", ct);
        Assert.Equal(expected, usersResponse.StatusCode);
        using var managersResponse = await client.GetAsync(
            "/v2/users/available-cruise-managers",
            ct
        );
        Assert.Equal(expected, managersResponse.StatusCode);
        if (expected == HttpStatusCode.OK)
        {
            var body = await usersResponse.Content.ReadAsStringAsync(ct);
            var users = (await usersResponse.Content.ReadFromJsonAsync<List<UserResponse>>(ct))!;
            var visibleIds =
                actorRole == RoleName.Administrator
                    ? ids.Values.Append(Guid.Parse(pending.Id))
                    : new[]
                    {
                        ids[RoleName.CruiseManager],
                        ids[RoleName.ShipCrew],
                        ids[RoleName.Guest],
                        Guid.Parse(pending.Id),
                    };
            Assert.Equal(visibleIds.Order(), users.Select(row => row.Id).Order());
            foreach (var user in users)
            {
                Assert.Equal("Test", user.FirstName);
                Assert.Equal("Researcher", user.LastName);
                Assert.True(user.EmailConfirmed);
                Assert.Equal(user.Id != Guid.Parse(pending.Id), user.Accepted);
                var role =
                    user.Id == Guid.Parse(pending.Id)
                        ? RoleName.CruiseManager
                        : ids.Single(pair => pair.Value == user.Id).Key;
                Assert.Equal(role, Assert.Single(user.Roles));
                Assert.Equal(
                    user.Id == Guid.Parse(pending.Id) ? pending.Email : role + "@example.invalid",
                    user.Email
                );
            }
            var managers = (
                await managersResponse.Content.ReadFromJsonAsync<List<CruiseManagerResponse>>(ct)
            )!;
            Assert.Equal(
                new[]
                {
                    ids[RoleName.Administrator],
                    ids[RoleName.Shipowner],
                    ids[RoleName.CruiseManager],
                }.Order(),
                managers.Select(row => row.Id).Order()
            );
            foreach (var manager in managers)
            {
                Assert.Equal("Test", manager.FirstName);
                Assert.Equal("Researcher", manager.LastName);
                Assert.Equal(
                    ids.Single(pair => pair.Value == manager.Id).Key + "@example.invalid",
                    manager.Email
                );
            }
            // The account list must expose no password, security stamp or refresh credential.
            using var json = JsonDocument.Parse(body);
            foreach (var user in json.RootElement.EnumerateArray())
                Assert.Equal(
                    PublicUserProperties,
                    user.EnumerateObject().Select(property => property.Name).Order()
                );
        }
        Assert.Equal(original, await Snapshot(app));
        await app.Dispatch(ct);
        Assert.Empty(app.Transport.Messages);
    }

    [Theory]
    [InlineData(RoleName.Administrator, HttpStatusCode.Forbidden)]
    [InlineData(RoleName.Shipowner, HttpStatusCode.Forbidden)]
    [InlineData(RoleName.CruiseManager, HttpStatusCode.NoContent)]
    [InlineData(RoleName.ShipCrew, HttpStatusCode.NoContent)]
    [InlineData(RoleName.Guest, HttpStatusCode.NoContent)]
    public async Task Update_WhenShipownerEditsAccount_EnforcesTargetRoleAndPreservesSession(
        string targetRole,
        HttpStatusCode expected
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var target = await TestUsers.Create(app, "target@example.invalid", targetRole);
        var office = await TestUsers.Create(app, "office@example.invalid", RoleName.Shipowner);
        using var targetClient = app.CreateApiClient();
        var session = await RefreshSessionTests.Login(targetClient, target.Email!);
        using var client = await TestApplications.Login(app, office.Email!);
        var original = await Snapshot(app);
        using var response = await client.PatchAsJsonAsync(
            $"/v2/users/{target.Id}",
            new { FirstName = "Updated", LastName = "Researcher" },
            ct
        );
        Assert.Equal(expected, response.StatusCode);
        if (expected == HttpStatusCode.NoContent)
        {
            var users = await client.GetFromJsonAsync<List<UserResponse>>("/v2/users", ct);
            Assert.Equal(
                "Updated",
                Assert.Single(users!, row => row.Id == Guid.Parse(target.Id)).FirstName
            );
            await app.InDatabase(async db =>
            {
                var stored = await db.Users.SingleAsync(row => row.Id == target.Id, ct);
                Assert.Equal("Updated", stored.FirstName);
            });
            Assert.Equal(original, await Snapshot(app, target.Id));
        }
        else
        {
            Assert.Equal(original, await Snapshot(app));
            var users = await client.GetFromJsonAsync<List<UserResponse>>("/v2/users", ct);
            Assert.DoesNotContain(users!, row => row.Id == Guid.Parse(target.Id));
        }
        using var refreshed = await RefreshSessionTests.SendCookie(
            targetClient,
            "/v2/auth/refresh",
            session.Cookie
        );
        Assert.Equal(HttpStatusCode.OK, refreshed.StatusCode);
        await app.InDatabase(async db =>
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct))
        );
        await app.Dispatch(ct);
        Assert.Empty(app.Transport.Messages);
    }

    private static async Task<string> Snapshot(TestApplication app, string? changedNameId = null)
    {
        var ct = TestContext.Current.CancellationToken;
        string snapshot = "";
        await app.InDatabase(async db =>
        {
            var users = await db
                .Users.OrderBy(row => row.Id)
                .Select(row => new
                {
                    row.Id,
                    row.Email,
                    row.NormalizedEmail,
                    row.UserName,
                    row.NormalizedUserName,
                    FirstName = row.Id == changedNameId ? "Test" : row.FirstName,
                    row.LastName,
                    row.EmailConfirmed,
                    row.Accepted,
                    row.PasswordHash,
                    row.SecurityStamp,
                    row.RefreshToken,
                    row.RefreshTokenExpiry,
                })
                .ToListAsync(ct);
            var roles = await db
                .UserRoles.OrderBy(row => row.UserId)
                .ThenBy(row => row.RoleId)
                .Select(row => new { row.UserId, row.RoleId })
                .ToListAsync(ct);
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
            snapshot = JsonSerializer.Serialize(new { users, roles });
        });
        return snapshot;
    }
}
