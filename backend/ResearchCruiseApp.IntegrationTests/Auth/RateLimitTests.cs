using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Auth;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Auth;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class RateLimitTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    // BE-INFRA-001: auth endpoints share the ten-attempt budget and advertise ProblemDetails.
    [Fact]
    public async Task Login_WhenAuthBudgetIsExhausted_ReturnsProblemWithoutCreatingSession()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var user = await TestUsers.Create(app, "limited@example.invalid");
        using var client = app.CreateApiClient();
        for (var attempt = 0; attempt < 10; attempt++)
        {
            using var denied = await client.PostAsync("/v2/auth/refresh", null, ct);
            Assert.Equal(HttpStatusCode.Unauthorized, denied.StatusCode);
        }
        using var response = await client.PostAsJsonAsync(
            "/v2/auth/login",
            new LoginRequest(user.Email!, TestUsers.Password),
            ct
        );
        Assert.Equal(HttpStatusCode.TooManyRequests, response.StatusCode);
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);
        var problem = await response.Content.ReadFromJsonAsync<JsonElement>(ct);
        Assert.Equal(429, problem.GetProperty("status").GetInt32());
        Assert.Equal("Too many requests.", problem.GetProperty("title").GetString());
        Assert.False(response.Headers.Contains("Set-Cookie"));
        await app.InDatabase(async db =>
        {
            var stored = Assert.Single(await db.Users.ToListAsync(ct));
            Assert.Null(stored.RefreshToken);
            Assert.Null(stored.RefreshTokenExpiry);
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        Assert.Empty(app.Transport.Messages);
        using var health = await client.GetAsync("/health", ct);
        Assert.Equal(HttpStatusCode.OK, health.StatusCode);
        Assert.Equal("Healthy", await health.Content.ReadAsStringAsync(ct));
    }
}
