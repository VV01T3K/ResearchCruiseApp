using System.Net;
using System.Net.Http.Headers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Net.Http.Headers;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Auth;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class LogoutTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public async Task Logout_WhenSessionExists_RevokesItAndPreservesAnotherAccount(bool useBearer)
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var user = await TestUsers.Create(app, "logout@example.invalid", RoleName.Guest);
        var other = await TestUsers.Create(app, "other-session@example.invalid", RoleName.Guest);
        using var client = app.CreateApiClient();
        var session = await RefreshSessionTests.Login(client, user.Email!);
        var otherSession = await RefreshSessionTests.Login(client, other.Email!);
        string? otherHash = null;
        await app.InDatabase(async db =>
            otherHash = (await db.Users.SingleAsync(row => row.Id == other.Id, ct)).RefreshToken
        );
        using var request = new HttpRequestMessage(HttpMethod.Post, "/v2/auth/logout");
        if (useBearer)
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", session.Access);
        else
            request.Headers.Add("Cookie", session.Cookie);

        using var response = await client.SendAsync(request, ct);

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        var deleted = Assert.Single(
            SetCookieHeaderValue.ParseList(response.Headers.GetValues("Set-Cookie").ToList()),
            cookie => cookie.Name == "rca_refresh_token"
        );
        Assert.True(deleted.HttpOnly);
        Assert.True(deleted.Secure);
        Assert.Equal(SameSiteMode.Strict, deleted.SameSite);
        Assert.Equal("/", deleted.Path.Value);
        Assert.True(deleted.Expires < new DateTimeOffset(2000, 1, 1, 0, 0, 0, TimeSpan.Zero));
        await app.InDatabase(async db =>
        {
            var stored = await db.Users.SingleAsync(row => row.Id == user.Id, ct);
            Assert.Null(stored.RefreshToken);
            Assert.Null(stored.RefreshTokenExpiry);
            Assert.Equal(
                otherHash,
                (await db.Users.SingleAsync(row => row.Id == other.Id, ct)).RefreshToken
            );
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        using var replay = await RefreshSessionTests.SendCookie(
            client,
            "/v2/auth/refresh",
            session.Cookie
        );
        Assert.Equal(HttpStatusCode.Unauthorized, replay.StatusCode);
        using var otherRefresh = await RefreshSessionTests.SendCookie(
            client,
            "/v2/auth/refresh",
            otherSession.Cookie
        );
        Assert.Equal(HttpStatusCode.OK, otherRefresh.StatusCode);
        Assert.Empty(app.Transport.Messages);
    }

    [Fact]
    public async Task Logout_OnAnotherDevice_RefusesEarlierAccessTokensButNotALaterSession()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var user = await TestUsers.Create(app, "two-devices@example.invalid", RoleName.Guest);
        using var deviceA = app.CreateApiClient();
        using var deviceB = app.CreateApiClient();
        var sessionA = await RefreshSessionTests.Login(deviceA, user.Email!);
        var sessionB = await RefreshSessionTests.Login(deviceB, user.Email!);
        Assert.Equal(HttpStatusCode.OK, await GetProfile(deviceA, sessionA.Access));

        using var logout = await Logout(deviceB, sessionB.Access);

        Assert.Equal(HttpStatusCode.NoContent, logout.StatusCode);
        Assert.Equal(HttpStatusCode.Unauthorized, await GetProfile(deviceA, sessionA.Access));
        Assert.Equal(HttpStatusCode.Unauthorized, await GetProfile(deviceB, sessionB.Access));

        var later = await RefreshSessionTests.Login(deviceB, user.Email!);
        Assert.Equal(HttpStatusCode.Unauthorized, await GetProfile(deviceA, sessionA.Access));
        using var staleLogout = await Logout(deviceA, sessionA.Access);
        Assert.Equal(HttpStatusCode.NoContent, staleLogout.StatusCode);
        Assert.Equal(HttpStatusCode.OK, await GetProfile(deviceB, later.Access));
    }

    private static async Task<HttpStatusCode> GetProfile(HttpClient client, string access)
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, "/v2/users/me");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", access);
        using var response = await client.SendAsync(request, TestContext.Current.CancellationToken);
        return response.StatusCode;
    }

    private static async Task<HttpResponseMessage> Logout(HttpClient client, string access)
    {
        using var request = new HttpRequestMessage(HttpMethod.Post, "/v2/auth/logout");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", access);
        return await client.SendAsync(request, TestContext.Current.CancellationToken);
    }
}
