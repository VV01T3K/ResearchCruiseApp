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
    public async Task Login_WhenEmailBudgetIsExhausted_RejectsOnlyThatEmail()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var user = await TestUsers.Create(app, "kelvin@example.invalid");
        var otherUser = await TestUsers.Create(app, "other@example.invalid");
        using var client = app.CreateApiClient();
        await ExhaustLoginBudget(app, client, user.Email!);

        using var response = await Login(
            client,
            "\u212AELVIN@ｅxample.invalid",
            TestUsers.Password
        );
        using var other = await Login(client, otherUser.Email!, TestUsers.Password);

        Assert.Equal(HttpStatusCode.TooManyRequests, response.StatusCode);
        Assert.NotNull(response.Headers.RetryAfter);
        var problem = await response.Content.ReadFromJsonAsync<JsonElement>(ct);
        Assert.Equal(
            "Wysłano zbyt wiele żądań. Odczekaj chwilę i spróbuj ponownie.",
            problem.GetProperty("detail").GetString()
        );
        Assert.Equal(HttpStatusCode.OK, other.StatusCode);
    }

    [Fact]
    public async Task Login_ForUnknownEmail_IsLimitedLikeAnExistingAccount()
    {
        await using var app = new TestApplication(fixture.ConnectionString);
        using var client = app.CreateApiClient();
        await ExhaustLoginBudget(app, client, "nobody@example.invalid");

        using var response = await Login(client, "ＮOBODY@example.invalid", TestUsers.Password);

        Assert.Equal(HttpStatusCode.TooManyRequests, response.StatusCode);
        Assert.NotNull(response.Headers.RetryAfter);
    }

    private static async Task ExhaustLoginBudget(
        TestApplication app,
        HttpClient client,
        string email
    )
    {
        var limit = app
            .Services.GetRequiredService<IConfiguration>()
            .GetValue<int>("RateLimiting:Login:PermitLimit");
        for (var attempt = 0; attempt < limit; attempt++)
        {
            using var denied = await Login(client, email, "WrongPassword1!");
            Assert.Equal(HttpStatusCode.Unauthorized, denied.StatusCode);
        }
    }

    private static Task<HttpResponseMessage> Login(
        HttpClient client,
        string email,
        string password
    ) =>
        client.PostAsJsonAsync(
            "/v2/auth/login",
            new LoginRequest(email, password),
            TestContext.Current.CancellationToken
        );
}
