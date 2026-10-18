using System.Globalization;
using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Auth;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class RateLimitTests(SqlFixture fixture) : IAsyncLifetime
{
    private const string Nginx = "172.18.0.3";

    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    [Fact]
    public async Task Login_WhenBudgetIsExhausted_ReturnsProblemWithRetryAfter()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        await ExhaustBudget(app, Nginx, _ => "203.0.113.10");
        var response = (await Login(app, Nginx, "203.0.113.10")).Response;
        Assert.Equal(StatusCodes.Status429TooManyRequests, response.StatusCode);
        Assert.InRange(
            int.Parse(response.Headers.RetryAfter!, CultureInfo.InvariantCulture),
            1,
            60
        );
        Assert.Equal("application/problem+json", response.ContentType);
        var problem = await JsonSerializer.DeserializeAsync<JsonElement>(
            response.Body,
            cancellationToken: ct
        );
        Assert.Equal(
            "Wysłano zbyt wiele żądań. Odczekaj chwilę i spróbuj ponownie.",
            problem.GetProperty("detail").GetString()
        );
        Assert.False(response.Headers.ContainsKey("Set-Cookie"));
    }

    [Fact]
    public async Task Login_FromDifferentForwardedClients_UsesSeparateBudgets()
    {
        await using var app = new TestApplication(fixture.ConnectionString);
        await ExhaustBudget(app, Nginx, _ => "203.0.113.10");
        var limited = await Login(app, Nginx, "203.0.113.10");
        var other = await Login(app, Nginx, "203.0.113.20");
        Assert.Equal(StatusCodes.Status429TooManyRequests, limited.Response.StatusCode);
        Assert.NotEqual(StatusCodes.Status429TooManyRequests, other.Response.StatusCode);
    }

    [Fact]
    public async Task Login_FromUntrustedPeer_IgnoresForwardedFor()
    {
        await using var app = new TestApplication(fixture.ConnectionString);
        await ExhaustBudget(app, "198.51.100.7", attempt => $"203.0.113.{attempt}");
        var response = await Login(app, "198.51.100.7", "203.0.113.200");
        Assert.Equal(StatusCodes.Status429TooManyRequests, response.Response.StatusCode);
    }

    private static async Task ExhaustBudget(
        TestApplication app,
        string peer,
        Func<int, string> clientIp
    )
    {
        var limit = app
            .Services.GetRequiredService<IConfiguration>()
            .GetValue<int>("RateLimiting:Login:PermitLimit");
        for (var attempt = 0; attempt < limit; attempt++)
        {
            var allowed = await Login(app, peer, clientIp(attempt));
            Assert.NotEqual(StatusCodes.Status429TooManyRequests, allowed.Response.StatusCode);
        }
    }

    private static Task<HttpContext> Login(TestApplication app, string peer, string clientIp) =>
        app.Server.SendAsync(context =>
        {
            context.Request.Method = HttpMethods.Post;
            context.Request.Scheme = "https";
            context.Request.Path = "/v2/auth/login";
            context.Request.Headers["X-Forwarded-For"] = clientIp;
            context.Connection.RemoteIpAddress = IPAddress.Parse(peer);
        });
}
