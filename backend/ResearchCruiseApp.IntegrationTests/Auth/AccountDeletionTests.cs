using System.Net;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Auth;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class AccountDeletionTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    // BE-ACCOUNT-005: deleting another account obeys role limits and preserves denied sessions.
    [Theory]
    [InlineData("anonymous", RoleName.Guest, HttpStatusCode.Unauthorized)]
    [InlineData(RoleName.CruiseManager, RoleName.Guest, HttpStatusCode.Forbidden)]
    [InlineData(RoleName.Guest, RoleName.Guest, HttpStatusCode.Forbidden)]
    [InlineData(RoleName.ShipCrew, RoleName.Guest, HttpStatusCode.Forbidden)]
    [InlineData(RoleName.Shipowner, RoleName.Administrator, HttpStatusCode.Forbidden)]
    [InlineData(RoleName.Shipowner, RoleName.Shipowner, HttpStatusCode.Forbidden)]
    [InlineData(RoleName.Shipowner, RoleName.Guest, HttpStatusCode.NoContent)]
    [InlineData(RoleName.Administrator, RoleName.Guest, HttpStatusCode.NoContent)]
    public async Task Delete_WhenActorRequestsAnotherAccount_EnforcesRoleLimitsAndSessionState(
        string actorRole,
        string targetRole,
        HttpStatusCode expected
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var target = await TestUsers.Create(app, "target@example.invalid", targetRole);
        using var targetClient = app.CreateApiClient();
        var targetSession = await RefreshSessionTests.Login(targetClient, target.Email!);
        string? originalRefresh = null;
        await app.InDatabase(async db =>
            originalRefresh = (
                await db.Users.SingleAsync(row => row.Id == target.Id, ct)
            ).RefreshToken
        );
        if (actorRole != "anonymous")
            await TestUsers.Create(app, "actor@example.invalid", actorRole);
        using var client =
            actorRole == "anonymous"
                ? app.CreateApiClient()
                : await TestApplications.Login(app, "actor@example.invalid");
        using var response = await client.DeleteAsync($"/v2/users/{target.Id}", ct);
        Assert.Equal(expected, response.StatusCode);
        var deleted = expected == HttpStatusCode.NoContent;
        await app.InDatabase(async db =>
        {
            var stored = await db.Users.SingleOrDefaultAsync(row => row.Id == target.Id, ct);
            var memberships = await db
                .UserRoles.Where(row => row.UserId == target.Id)
                .ToListAsync(ct);
            if (deleted)
            {
                Assert.Null(stored);
                Assert.Empty(memberships);
            }
            else
            {
                Assert.NotNull(stored);
                Assert.Equal(target.PasswordHash, stored.PasswordHash);
                Assert.Equal(originalRefresh, stored.RefreshToken);
                var membership = Assert.Single(memberships);
                Assert.Equal(
                    targetRole,
                    (await db.Roles.SingleAsync(role => role.Id == membership.RoleId, ct)).Name
                );
            }
            Assert.Equal(
                (actorRole == "anonymous" ? 1 : 2) - (deleted ? 1 : 0),
                await db.Users.CountAsync(ct)
            );
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        using var refresh = await RefreshSessionTests.SendCookie(
            targetClient,
            "/v2/auth/refresh",
            targetSession.Cookie
        );
        Assert.Equal(deleted ? HttpStatusCode.Unauthorized : HttpStatusCode.OK, refresh.StatusCode);
        Assert.Empty(app.Transport.Messages);
    }
}
