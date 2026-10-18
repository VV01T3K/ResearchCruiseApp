using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ResearchCruiseApp.Api.Auth;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Auth;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class RateLimitTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    [Fact]
    public async Task Login_WhenAuthBudgetIsExhausted_ReturnsProblemWithRetryAfter()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var user = await TestUsers.Create(app, "limited@example.invalid");
        using var client = app.CreateApiClient();
        await ExhaustBudget(app, client, "203.0.113.10", ct);
        using var request = new HttpRequestMessage(HttpMethod.Post, "/v2/auth/login")
        {
            Content = JsonContent.Create(new LoginRequest(user.Email!, TestUsers.Password)),
        };
        request.Headers.Add("X-Forwarded-For", "203.0.113.10");
        using var response = await client.SendAsync(request, ct);
        Assert.Equal(HttpStatusCode.TooManyRequests, response.StatusCode);
        Assert.InRange(response.Headers.RetryAfter!.Delta!.Value.TotalSeconds, 1, 60);
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);
        var problem = await response.Content.ReadFromJsonAsync<JsonElement>(ct);
        Assert.Equal(
            "Wysłano zbyt wiele żądań. Odczekaj chwilę i spróbuj ponownie.",
            problem.GetProperty("detail").GetString()
        );
        Assert.False(response.Headers.Contains("Set-Cookie"));
    }

    [Fact]
    public async Task Refresh_FromDifferentForwardedClients_UsesSeparateBudgets()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        using var client = app.CreateApiClient();
        await ExhaustBudget(app, client, "203.0.113.10", ct);
        using var limited = await Refresh(client, "203.0.113.10", ct);
        using var other = await Refresh(client, "203.0.113.20", ct);
        Assert.Equal(HttpStatusCode.TooManyRequests, limited.StatusCode);
        Assert.Equal(HttpStatusCode.Unauthorized, other.StatusCode);
    }

    private static async Task ExhaustBudget(
        TestApplication app,
        HttpClient client,
        string clientIp,
        CancellationToken ct
    )
    {
        var limit = app
            .Services.GetRequiredService<IConfiguration>()
            .GetValue<int>("RateLimiting:AuthSensitive:PermitLimit");
        for (var attempt = 0; attempt < limit; attempt++)
        {
            using var allowed = await Refresh(client, clientIp, ct);
            Assert.Equal(HttpStatusCode.Unauthorized, allowed.StatusCode);
        }
    }

    private static Task<HttpResponseMessage> Refresh(
        HttpClient client,
        string clientIp,
        CancellationToken ct
    )
    {
        var request = new HttpRequestMessage(HttpMethod.Post, "/v2/auth/refresh");
        request.Headers.Add("X-Forwarded-For", clientIp);
        return client.SendAsync(request, ct);
    }
}
