using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Net.Http.Headers;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Auth;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class RefreshSessionTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    // BE-AUTH-003: refresh consumes the old credential; replay cannot change the new session.
    [Fact]
    public async Task Refresh_WhenUsedThenReplayed_RotatesAndPreservesTheNewSession()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var user = await TestUsers.Create(app, "rotation@example.invalid", RoleName.Guest);
        using var client = app.CreateApiClient();
        var original = await Login(client, user.Email!);
        string? originalHash = null;
        await app.InDatabase(async db =>
            originalHash = (await db.Users.SingleAsync(ct)).RefreshToken
        );

        using var rotated = await SendCookie(client, "/v2/auth/refresh", original.Cookie);
        Assert.Equal(HttpStatusCode.OK, rotated.StatusCode);
        var replacement = ReadCookie(rotated);
        Assert.NotEqual(original.Cookie, replacement);
        var access = await ReadAccessToken(rotated);
        using var profileRequest = new HttpRequestMessage(HttpMethod.Get, "/v2/users/me");
        profileRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", access);
        using var profile = await client.SendAsync(profileRequest, ct);
        Assert.Equal(HttpStatusCode.OK, profile.StatusCode);

        string? replacementHash = null;
        DateTime? replacementExpiry = null;
        await app.InDatabase(async db =>
        {
            var stored = await db.Users.SingleAsync(ct);
            replacementHash = stored.RefreshToken;
            replacementExpiry = stored.RefreshTokenExpiry;
            Assert.NotNull(replacementHash);
            Assert.NotEqual(originalHash, replacementHash);
        });
        using var replay = await SendCookie(client, "/v2/auth/refresh", original.Cookie);
        Assert.Equal(HttpStatusCode.Unauthorized, replay.StatusCode);
        Assert.False(replay.Headers.Contains("Set-Cookie"));
        await app.InDatabase(async db =>
        {
            var stored = await db.Users.SingleAsync(ct);
            Assert.Equal(replacementHash, stored.RefreshToken);
            Assert.Equal(replacementExpiry, stored.RefreshTokenExpiry);
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        using var next = await SendCookie(client, "/v2/auth/refresh", replacement);
        Assert.Equal(HttpStatusCode.OK, next.StatusCode);
        Assert.NotEqual(replacement, ReadCookie(next));
        Assert.Empty(app.Transport.Messages);
    }

    // BE-AUTH-004: invalid or ineligible refresh requests cannot mutate an existing session.
    [Theory]
    [InlineData("missing")]
    [InlineData("invalid")]
    [InlineData("expired")]
    [InlineData("unaccepted")]
    [InlineData("unconfirmed")]
    public async Task Refresh_WhenCredentialOrAccountIsIneligible_DeniesWithoutChangingSession(
        string reason
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var user = await TestUsers.Create(
            app,
            "ineligible-refresh@example.invalid",
            RoleName.Guest
        );
        using var client = app.CreateApiClient();
        var session = await Login(client, user.Email!);
        string? tokenHash = null;
        DateTime? expiry = null;
        await app.InDatabase(async db =>
        {
            var stored = await db.Users.SingleAsync(ct);
            if (reason == "expired")
                stored.RefreshTokenExpiry = new DateTime(2000, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            if (reason == "unaccepted")
                stored.Accepted = false;
            if (reason == "unconfirmed")
                stored.EmailConfirmed = false;
            await db.SaveChangesAsync(ct);
            tokenHash = stored.RefreshToken;
            expiry = stored.RefreshTokenExpiry;
        });

        var cookie = reason switch
        {
            "missing" => null,
            "invalid" => "rca_refresh_token=not-a-valid-session",
            _ => session.Cookie,
        };
        using var response = await SendCookie(client, "/v2/auth/refresh", cookie);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        Assert.False(response.Headers.Contains("Set-Cookie"));
        await app.InDatabase(async db =>
        {
            var stored = await db.Users.SingleAsync(ct);
            Assert.Equal(tokenHash, stored.RefreshToken);
            Assert.Equal(expiry, stored.RefreshTokenExpiry);
            Assert.Equal(reason != "unaccepted", stored.Accepted);
            Assert.Equal(reason != "unconfirmed", stored.EmailConfirmed);
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        Assert.Empty(app.Transport.Messages);
    }

    internal static async Task<(string Cookie, string Access)> Login(
        HttpClient client,
        string email
    )
    {
        using var response = await client.PostAsJsonAsync(
            "/v2/auth/login",
            new { Email = email, Password = TestUsers.Password },
            TestContext.Current.CancellationToken
        );
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        return (ReadCookie(response), await ReadAccessToken(response));
    }

    internal static string ReadCookie(HttpResponseMessage response)
    {
        var cookie = Assert.Single(
            SetCookieHeaderValue.ParseList(response.Headers.GetValues("Set-Cookie").ToList()),
            value => value.Name == "rca_refresh_token"
        );
        return cookie.Name + "=" + cookie.Value;
    }

    internal static async Task<string> ReadAccessToken(HttpResponseMessage response)
    {
        using var body = await JsonDocument.ParseAsync(
            await response.Content.ReadAsStreamAsync(TestContext.Current.CancellationToken),
            cancellationToken: TestContext.Current.CancellationToken
        );
        Assert.False(body.RootElement.TryGetProperty("refreshToken", out _));
        return body.RootElement.GetProperty("accessToken").GetString()!;
    }

    internal static async Task<HttpResponseMessage> SendCookie(
        HttpClient client,
        string route,
        string? cookie
    )
    {
        using var request = new HttpRequestMessage(HttpMethod.Post, route);
        if (cookie is not null)
            request.Headers.Add("Cookie", cookie);
        return await client.SendAsync(request, TestContext.Current.CancellationToken);
    }
}
