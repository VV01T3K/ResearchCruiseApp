using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Auth;

namespace ResearchCruiseApp.IntegrationTests.Infrastructure;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class ProblemDetailsTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    // BE-INFRA-007: failed logins, bodiless failures and Identity errors explain themselves in Polish.
    [Fact]
    public async Task Request_WhenItFailsWithoutFieldErrors_ReturnsPolishProblemDetail()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var user = await TestUsers.Create(app, "problem@example.invalid");
        using var client = app.CreateApiClient();

        await AssertProblem(
            await client.PostAsJsonAsync(
                "/v2/auth/login",
                new LoginRequest(user.Email!, "IncorrectPassword1!"),
                ct
            ),
            HttpStatusCode.Unauthorized,
            "Podano błędne hasło lub użytkownik nie istnieje."
        );
        await AssertProblem(
            await client.GetAsync("/v2/applications", ct),
            HttpStatusCode.Unauthorized,
            "Sesja wygasła. Zaloguj się ponownie."
        );
        await AssertProblem(
            await client.GetAsync("/v2/does-not-exist", ct),
            HttpStatusCode.NotFound,
            "Nie znaleziono żądanego zasobu. Mógł zostać usunięty."
        );
        await AssertProblem(
            await client.PostAsJsonAsync(
                "/v2/auth/register",
                new RegisterAccountRequest(user.Email!, TestUsers.Password, "Anna", "Nowak"),
                ct
            ),
            HttpStatusCode.BadRequest,
            $"Adres e-mail '{user.Email}' jest już zajęty."
        );
        await app.InDatabase(async db =>
        {
            var stored = Assert.Single(await db.Users.ToListAsync(ct));
            Assert.Null(stored.RefreshToken);
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
    }

    // BE-INFRA-007: validation problems key Polish messages by camelCase JSON path, without detail.
    [Fact]
    public async Task Register_WhenFieldsAreEmpty_ReturnsPolishErrorsByJsonPath()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        using var client = app.CreateApiClient();

        using var response = await client.PostAsJsonAsync(
            "/v2/auth/register",
            new RegisterAccountRequest("anna@example.invalid", "", "", "Nowak"),
            ct
        );

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);
        using var problem = JsonDocument.Parse(await response.Content.ReadAsStringAsync(ct));
        Assert.False(problem.RootElement.TryGetProperty("detail", out _));
        var errors = problem.RootElement.GetProperty("errors");
        Assert.Equal(
            ["firstName", "password"],
            errors.EnumerateObject().Select(error => error.Name).Order()
        );
        Assert.Equal(
            "Pole 'Hasło' nie może być puste.",
            Assert.Single(errors.GetProperty("password").EnumerateArray()).GetString()
        );
        Assert.Equal(
            "Pole 'Imię' nie może być puste.",
            Assert.Single(errors.GetProperty("firstName").EnumerateArray()).GetString()
        );
        await app.InDatabase(async db => Assert.Empty(await db.Users.ToListAsync(ct)));
    }

    private static async Task AssertProblem(
        HttpResponseMessage response,
        HttpStatusCode status,
        string detail
    )
    {
        using (response)
        {
            Assert.Equal(status, response.StatusCode);
            Assert.Equal(
                "application/problem+json",
                response.Content.Headers.ContentType?.MediaType
            );
            using var problem = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
            Assert.Equal(detail, problem.RootElement.GetProperty("detail").GetString());
        }
    }
}
