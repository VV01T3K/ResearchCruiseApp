using System.Globalization;
using System.Net;
using System.Net.Http.Json;
using ResearchCruiseApp.Api.Auth;
using Xunit;

namespace ResearchCruiseApp.Tests;

/// <summary>
/// Covers the separate auth rate-limit buckets. Needs a factory of its own: the limiter is a
/// singleton, so sharing one with the other endpoint tests would let them drain each other.
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
    /// Refresh and login use separate policies, so exhausting the refresh bucket does not affect
    /// login.
    /// </summary>
    [Fact]
    public async Task RefreshAndLoginUseSeparateRateLimitPolicies()
    {
        using var client = _factory.CreateSessionClient();

        HttpResponseMessage? lastResponse = null;
        for (var attempt = 0; attempt <= RefreshPermitLimit; attempt++)
        {
            lastResponse = await RefreshAsync(client);
        }

        Assert.Equal(HttpStatusCode.TooManyRequests, lastResponse!.StatusCode);
        Assert.NotNull(lastResponse.Headers.RetryAfter);

        var loginResponse = await LoginAsync(client);
        Assert.NotEqual(HttpStatusCode.TooManyRequests, loginResponse.StatusCode);

        // The successful login above consumed the first permit.
        for (var attempt = 1; attempt <= LoginPermitLimit; attempt++)
        {
            lastResponse = await LoginAsync(client);
        }

        Assert.Equal(HttpStatusCode.TooManyRequests, lastResponse!.StatusCode);
        Assert.NotNull(lastResponse.Headers.RetryAfter);
    }

    private static Task<HttpResponseMessage> LoginAsync(HttpClient client)
    {
        return client.PostAsJsonAsync(
            "/v2/auth/login",
            new LoginRequest(
                AuthWebApplicationFactory.UserEmail,
                AuthWebApplicationFactory.UserPassword
            )
        );
    }

    private static Task<HttpResponseMessage> RefreshAsync(HttpClient client)
    {
        // The limiter runs ahead of the endpoint, so even an unauthenticated refresh consumes a
        // permit from its IP partition.
        return client.PostAsync("/v2/auth/refresh", null);
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
                }
            );

        public void Dispose() => Factory.Dispose();
    }
}
