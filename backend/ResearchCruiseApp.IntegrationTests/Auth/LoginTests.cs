using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Net.Http.Headers;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Auth;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class LoginTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    [Theory]
    [InlineData("Testing", true)]
    [InlineData("Development", false)]
    public async Task Login_WhenAcceptedAndConfirmed_ReturnsAccessTokenAndProtectedRefreshSession(
        string environment,
        bool secure
    )
    {
        var cancellationToken = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString, environment);
        var user = await TestUsers.Create(app, "login@example.invalid");
        using var client = app.CreateApiClient();

        var before = DateTime.UtcNow;
        using var response = await client.PostAsJsonAsync(
            "/v2/auth/login",
            new { Email = user.Email, Password = TestUsers.Password },
            cancellationToken
        );

        var after = DateTime.UtcNow;
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        using var body = await JsonDocument.ParseAsync(
            await response.Content.ReadAsStreamAsync(cancellationToken),
            cancellationToken: cancellationToken
        );
        Assert.NotEmpty(body.RootElement.GetProperty("accessToken").GetString()!);
        Assert.False(body.RootElement.TryGetProperty("refreshToken", out _));
        var cookie = Assert.Single(
            SetCookieHeaderValue.ParseList(response.Headers.GetValues("Set-Cookie").ToList()),
            header => header.Name == "rca_refresh_token"
        );
        Assert.Equal(secure, cookie.Secure);
        Assert.True(cookie.HttpOnly);
        Assert.Equal(SameSiteMode.Strict, cookie.SameSite);
        Assert.Equal("/", cookie.Path.Value);
        var accessExpiry = body.RootElement.GetProperty("accessTokenExpirationDate").GetDateTime();
        var refreshExpiry = body
            .RootElement.GetProperty("refreshTokenExpirationDate")
            .GetDateTime();
        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(
            body.RootElement.GetProperty("accessToken").GetString()
        );
        Assert.Equal(
            new DateTimeOffset(accessExpiry).ToUnixTimeSeconds(),
            new DateTimeOffset(jwt.ValidTo).ToUnixTimeSeconds()
        );
        Assert.InRange(
            new DateTimeOffset(accessExpiry).ToUnixTimeSeconds(),
            new DateTimeOffset(before.AddSeconds(900)).ToUnixTimeSeconds(),
            new DateTimeOffset(after.AddSeconds(900)).ToUnixTimeSeconds()
        );
        Assert.InRange(refreshExpiry, before.AddSeconds(7200), after.AddSeconds(7200));
        Assert.NotNull(cookie.Expires);
        Assert.Equal(
            new DateTimeOffset(refreshExpiry).ToUnixTimeSeconds(),
            cookie.Expires.Value.ToUnixTimeSeconds()
        );
        await app.InDatabase(async db =>
        {
            var stored = await db.Users.SingleAsync(row => row.Id == user.Id, cancellationToken);
            Assert.False(string.IsNullOrWhiteSpace(stored.RefreshToken));
            Assert.NotEqual(cookie.Value.Value, stored.RefreshToken);
            Assert.Equal(
                Convert.ToBase64String(
                    SHA256.HashData(
                        Encoding.UTF8.GetBytes(Uri.UnescapeDataString(cookie.Value.Value!))
                    )
                ),
                stored.RefreshToken
            );
            Assert.Equal(refreshExpiry, stored.RefreshTokenExpiry);
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(cancellationToken));
        });
        Assert.Empty(app.Transport.Messages);
    }

    [Fact]
    public async Task Login_AfterRepeatedWrongPasswords_LocksOutTheAccount()
    {
        var cancellationToken = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var user = await TestUsers.Create(app, "lockout@example.invalid");
        using var client = app.CreateApiClient();
        for (var attempt = 0; attempt < 5; attempt++)
        {
            using var wrong = await client.PostAsJsonAsync(
                "/v2/auth/login",
                new { Email = user.Email, Password = "WrongPassword1!" },
                cancellationToken
            );
            Assert.Equal(HttpStatusCode.Unauthorized, wrong.StatusCode);
        }

        using var response = await client.PostAsJsonAsync(
            "/v2/auth/login",
            new { Email = user.Email, Password = TestUsers.Password },
            cancellationToken
        );

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        var problem = await response.Content.ReadFromJsonAsync<JsonElement>(cancellationToken);
        Assert.Equal(
            "Konto zostało tymczasowo zablokowane po zbyt wielu nieudanych próbach logowania. Spróbuj ponownie później.",
            problem.GetProperty("detail").GetString()
        );
        Assert.False(response.Headers.Contains("Set-Cookie"));
    }
}
