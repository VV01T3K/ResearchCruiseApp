using System.Globalization;
using System.Net;
using System.Net.Http.Json;
using ResearchCruiseApp.Api.Auth;
using Xunit;

namespace ResearchCruiseApp.Tests;

/// <summary>
/// Covers how the auth limiters partition their buckets. Needs a factory of its own: the limiter is
/// a singleton, so sharing one with the other endpoint tests would let them drain each other.
/// </summary>
public sealed class AuthSessionRateLimitingTests
    : IClassFixture<AuthSessionRateLimitingTests.Fixture>,
        IAsyncLifetime
{
    private const int LoginPermitLimit = 3;
    private const int RefreshPermitLimit = 20;

    private readonly AuthWebApplicationFactory _factory;

    public AuthSessionRateLimitingTests(Fixture fixture)
    {
        _factory = fixture.Factory;
    }

    public Task InitializeAsync() => _factory.SeedUserAsync();

    public Task DisposeAsync() => Task.CompletedTask;

    /// <summary>
    /// Doubles as the check that the forwarded-headers wiring works: without
    /// <c>UseForwardedHeaders</c> running first, every request would share one partition and the
    /// second client would be throttled too.
    /// </summary>
    [Fact]
    public async Task LoginThrottlingIsPartitionedByTheForwardedClientIp()
    {
        using var client = _factory.CreateSessionClient();

        HttpResponseMessage? lastResponse = null;
        for (var attempt = 0; attempt <= LoginPermitLimit; attempt++)
        {
            lastResponse = await LoginAsync(client, "203.0.113.1");
        }

        Assert.Equal(HttpStatusCode.TooManyRequests, lastResponse!.StatusCode);
        Assert.NotNull(lastResponse.Headers.RetryAfter);

        var otherClient = await LoginAsync(client, "203.0.113.2");

        Assert.NotEqual(HttpStatusCode.TooManyRequests, otherClient.StatusCode);
    }

    /// <summary>
    /// Refresh and login use separate IP-partitioned policies, so exhausting either bucket does not
    /// affect the other.
    /// </summary>
    [Fact]
    public async Task RefreshThrottlingIsPartitionedByAddressAndSeparateFromLogin()
    {
        using var client = _factory.CreateSessionClient();
        const string refreshLimitedIp = "198.51.100.7";

        HttpResponseMessage? lastResponse = null;
        for (var attempt = 0; attempt <= RefreshPermitLimit; attempt++)
        {
            lastResponse = await RefreshAsync(client, refreshLimitedIp);
        }

        Assert.Equal(HttpStatusCode.TooManyRequests, lastResponse!.StatusCode);

        var otherAddress = await RefreshAsync(client, "198.51.100.8");
        Assert.NotEqual(HttpStatusCode.TooManyRequests, otherAddress.StatusCode);

        var loginOnRefreshLimitedIp = await LoginAsync(client, refreshLimitedIp);
        Assert.NotEqual(HttpStatusCode.TooManyRequests, loginOnRefreshLimitedIp.StatusCode);

        const string loginLimitedIp = "198.51.100.9";
        for (var attempt = 0; attempt <= LoginPermitLimit; attempt++)
        {
            lastResponse = await LoginAsync(client, loginLimitedIp);
        }

        Assert.Equal(HttpStatusCode.TooManyRequests, lastResponse!.StatusCode);

        var refreshOnLoginLimitedIp = await RefreshAsync(client, loginLimitedIp);
        Assert.NotEqual(HttpStatusCode.TooManyRequests, refreshOnLoginLimitedIp.StatusCode);
    }

    private static async Task<HttpResponseMessage> LoginAsync(
        HttpClient client,
        string forwardedFor
    )
    {
        using var request = new HttpRequestMessage(HttpMethod.Post, "/v2/auth/login")
        {
            Content = JsonContent.Create(
                new LoginRequest(
                    AuthWebApplicationFactory.UserEmail,
                    AuthWebApplicationFactory.UserPassword
                )
            ),
        };
        request.Headers.Add("X-Forwarded-For", forwardedFor);

        return await client.SendAsync(request);
    }

    private static async Task<HttpResponseMessage> RefreshAsync(
        HttpClient client,
        string forwardedFor
    )
    {
        // The limiter runs ahead of the endpoint, so even an unauthenticated refresh consumes a
        // permit from its IP partition.
        using var request = new HttpRequestMessage(HttpMethod.Post, "/v2/auth/refresh");
        request.Headers.Add("X-Forwarded-For", forwardedFor);

        return await client.SendAsync(request);
    }

    public sealed class Fixture : IDisposable
    {
        internal AuthWebApplicationFactory Factory { get; } =
            new(
                new Dictionary<string, string?>
                {
                    ["RateLimiting:AuthSensitive:PermitLimit"] = LoginPermitLimit.ToString(
                        CultureInfo.InvariantCulture
                    ),
                    // TestServer leaves RemoteIpAddress unset, so the middleware would otherwise
                    // refuse to honour X-Forwarded-For from an unknown proxy.
                    ["ForwardedHeaders:TrustAllProxies"] = "true",
                }
            );

        public void Dispose() => Factory.Dispose();
    }
}
