using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using ResearchCruiseApp.Api.Auth;
using Xunit;

namespace ResearchCruiseApp.Tests;

public sealed class ProblemDetailsEndpointTests
{
    [Fact]
    public async Task FailedLoginExplainsTheReasonInPolish()
    {
        await using var factory = await CreateFactoryAsync();
        using var client = factory.CreateSessionClient();

        var response = await client.PostAsJsonAsync(
            "/v2/auth/login",
            new LoginRequest(AuthWebApplicationFactory.UserEmail, "WrongPassword1!")
        );

        await AssertProblemAsync(
            response,
            HttpStatusCode.Unauthorized,
            "Podano błędne hasło lub użytkownik nie istnieje."
        );
    }

    [Fact]
    public async Task BodilessAuthAndRoutingFailuresBecomePolishProblems()
    {
        await using var factory = await CreateFactoryAsync();
        using var client = factory.CreateSessionClient();

        await AssertProblemAsync(
            await client.GetAsync("/v2/applications"),
            HttpStatusCode.Unauthorized,
            "Sesja wygasła. Zaloguj się ponownie."
        );
        await AssertProblemAsync(
            await client.GetAsync("/v2/does-not-exist"),
            HttpStatusCode.NotFound,
            "Nie znaleziono żądanego zasobu. Mógł zostać usunięty."
        );
    }

    [Fact]
    public async Task IdentityErrorsAreReportedInPolish()
    {
        await using var factory = await CreateFactoryAsync();
        using var client = factory.CreateSessionClient();

        var response = await client.PostAsJsonAsync(
            "/v2/auth/register",
            new RegisterAccountRequest(
                AuthWebApplicationFactory.UserEmail,
                "Password1!",
                "Anna",
                "Nowak"
            )
        );

        await AssertProblemAsync(
            response,
            HttpStatusCode.BadRequest,
            $"Adres e-mail '{AuthWebApplicationFactory.UserEmail}' jest już zajęty."
        );
    }

    [Fact]
    public async Task RateLimitedRequestsExplainTheReasonInPolish()
    {
        await using var factory = await CreateFactoryAsync();
        using var client = factory.CreateSessionClient();
        var request = new LoginRequest(AuthWebApplicationFactory.UserEmail, "WrongPassword1!");

        HttpResponseMessage response;
        do
        {
            response = await client.PostAsJsonAsync("/v2/auth/login", request);
        } while (response.StatusCode == HttpStatusCode.Unauthorized);

        await AssertProblemAsync(
            response,
            HttpStatusCode.TooManyRequests,
            "Wysłano zbyt wiele żądań. Odczekaj chwilę i spróbuj ponownie."
        );
    }

    [Fact]
    public async Task ValidationProblemsExplainThemselvesThroughFieldErrors()
    {
        await using var factory = await CreateFactoryAsync();
        using var client = factory.CreateSessionClient();

        var response = await client.PostAsJsonAsync(
            "/v2/auth/register",
            new RegisterAccountRequest("anna@example.com", "", "Anna", "Nowak")
        );

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        using var problem = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        Assert.False(problem.RootElement.TryGetProperty("detail", out _));
        Assert.Equal(
            "Pole 'Hasło' nie może być puste.",
            problem.RootElement.GetProperty("errors").GetProperty("password")[0].GetString()
        );
    }

    private static async Task<AuthWebApplicationFactory> CreateFactoryAsync()
    {
        var factory = new AuthWebApplicationFactory();
        await factory.SeedUserAsync();
        return factory;
    }

    private static async Task AssertProblemAsync(
        HttpResponseMessage response,
        HttpStatusCode status,
        string detail
    )
    {
        Assert.Equal(status, response.StatusCode);
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);
        using var problem = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        Assert.Equal(detail, problem.RootElement.GetProperty("detail").GetString());
    }
}
