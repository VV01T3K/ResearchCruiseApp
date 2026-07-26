using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing.Handlers;
using Microsoft.Net.Http.Headers;
using ResearchCruiseApp.Api.Auth;
using Xunit;

namespace ResearchCruiseApp.Tests;

/// <summary>
/// Exercises the real HTTP pipeline for the refresh-cookie session contract.
/// </summary>
public sealed class AuthSessionEndpointTests
    : IClassFixture<AuthSessionEndpointTests.Fixture>,
        IAsyncLifetime
{
    private const string RefreshCookieName = "rca_refresh_token";
    private const string LoginPath = "/v2/auth/login";
    private const string RefreshPath = "/v2/auth/refresh";
    private const string LogoutPath = "/v2/auth/logout";

    private readonly AuthWebApplicationFactory _factory;

    public AuthSessionEndpointTests(Fixture fixture)
    {
        _factory = fixture.Factory;
    }

    public Task InitializeAsync() => _factory.SeedUserAsync();

    public Task DisposeAsync() => Task.CompletedTask;

    /// <summary>
    /// The regression test for the cookie-path defect.
    /// </summary>
    /// <remarks>
    /// Asserting <c>Path == "/"</c> would only restate the implementation. What actually matters is
    /// that the browser will send the cookie back, and the browser matches Path against the URL it
    /// requested — which carries an <c>/api</c> prefix in every containerized topology, because
    /// frontend/nginx.conf proxies <c>location /api/</c> with a trailing slash and strips the prefix
    /// before the backend ever sees it. Do not delete the <c>/api</c> assertion to make a failure go
    /// away: it is the entire point of this test.
    /// </remarks>
    [Fact]
    public async Task RefreshCookieIsSentBackOnEveryDeployedTopology()
    {
        using var client = _factory.CreateSessionClient();

        var loginResponse = await LoginAsync(client);
        var cookie = GetRefreshCookie(loginResponse);

        Assert.True(
            PathMatches("/v2/auth/refresh", cookie.Path.Value!),
            $"Cookie path '{cookie.Path}' does not match the vite dev server URL /v2/auth/refresh."
        );
        Assert.True(
            PathMatches("/api/v2/auth/refresh", cookie.Path.Value!),
            $"Cookie path '{cookie.Path}' does not match the URL the browser requests behind nginx, "
                + "/api/v2/auth/refresh. See frontend/nginx.conf."
        );
    }

    [Fact]
    public async Task SessionSurvivesARefreshRoundTripAndDiesOnLogout()
    {
        var handler = new CookieContainerHandler();
        using var client = _factory.CreateSessionClient(handler);

        var loginResponse = await LoginAsync(client);
        loginResponse.EnsureSuccessStatusCode();
        var cookieUri = _factory.ClientOptions.BaseAddress;
        var afterLogin = handler.Container.GetCookies(cookieUri)[RefreshCookieName]?.Value;
        Assert.False(string.IsNullOrEmpty(afterLogin));

        var refreshResponse = await client.PostAsync(RefreshPath, content: null);

        Assert.Equal(HttpStatusCode.OK, refreshResponse.StatusCode);
        var afterRefresh = handler.Container.GetCookies(cookieUri)[RefreshCookieName]?.Value;
        Assert.False(string.IsNullOrEmpty(afterRefresh));
        Assert.NotEqual(afterLogin, afterRefresh);

        var logoutResponse = await client.PostAsync(LogoutPath, content: null);

        Assert.Equal(HttpStatusCode.NoContent, logoutResponse.StatusCode);
        Assert.True(
            string.IsNullOrEmpty(handler.Container.GetCookies(cookieUri)[RefreshCookieName]?.Value)
        );

        var refreshAfterLogout = await client.PostAsync(RefreshPath, content: null);

        Assert.Equal(HttpStatusCode.Unauthorized, refreshAfterLogout.StatusCode);
    }

    /// <summary>
    /// Pins the rotation semantics that CreateLoginResponseDto provides implicitly: the previous
    /// cookie value must not survive the refresh that replaced it.
    /// </summary>
    [Fact]
    public async Task ReplayingARotatedRefreshCookieIsRejected()
    {
        using var client = _factory.CreateSessionClient();

        var loginResponse = await LoginAsync(client);
        var originalValue = GetRefreshCookie(loginResponse).Value.Value!;

        var refreshResponse = await SendWithRefreshCookieAsync(client, RefreshPath, originalValue);
        Assert.Equal(HttpStatusCode.OK, refreshResponse.StatusCode);
        Assert.NotEqual(originalValue, GetRefreshCookie(refreshResponse).Value.Value);

        var replayResponse = await SendWithRefreshCookieAsync(client, RefreshPath, originalValue);

        Assert.Equal(HttpStatusCode.Unauthorized, replayResponse.StatusCode);
    }

    [Fact]
    public async Task RefreshCookieHasSecureBrowserAttributes()
    {
        using var client = _factory.CreateSessionClient();

        var cookie = GetRefreshCookie(await LoginAsync(client));

        Assert.True(cookie.HttpOnly);
        Assert.True(cookie.Secure);
        Assert.Equal(Microsoft.Net.Http.Headers.SameSiteMode.Strict, cookie.SameSite);
    }

    private static Task<HttpResponseMessage> LoginAsync(HttpClient client) =>
        client.PostAsJsonAsync(
            LoginPath,
            new LoginRequest(
                AuthWebApplicationFactory.UserEmail,
                AuthWebApplicationFactory.UserPassword
            )
        );

    private static async Task<HttpResponseMessage> SendWithRefreshCookieAsync(
        HttpClient client,
        string path,
        string refreshToken
    )
    {
        using var request = new HttpRequestMessage(HttpMethod.Post, path);
        request.Headers.Add(HeaderNames.Cookie, $"{RefreshCookieName}={refreshToken}");

        return await client.SendAsync(request);
    }

    private static SetCookieHeaderValue GetRefreshCookie(HttpResponseMessage response)
    {
        Assert.True(
            response.Headers.TryGetValues(HeaderNames.SetCookie, out var values),
            "The response carried no Set-Cookie header."
        );

        return SetCookieHeaderValue
            .ParseList([.. values!])
            .Single(cookie => cookie.Name == RefreshCookieName);
    }

    /// <summary>RFC 6265 section 5.1.4 path-match.</summary>
    private static bool PathMatches(string requestPath, string cookiePath)
    {
        if (string.Equals(requestPath, cookiePath, StringComparison.Ordinal))
            return true;
        if (!requestPath.StartsWith(cookiePath, StringComparison.Ordinal))
            return false;

        return cookiePath.EndsWith('/') || requestPath[cookiePath.Length] == '/';
    }

    public sealed class Fixture : IDisposable
    {
        internal AuthWebApplicationFactory Factory { get; } = new();

        public void Dispose() => Factory.Dispose();
    }
}
