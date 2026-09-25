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

    // BE-AUTH-001: real login in a fresh host, real Identity and SQL persistence.
    [Fact]
    public async Task Login_WhenAcceptedAndConfirmed_ReturnsAccessTokenAndProtectedRefreshSession()
    {
        var cancellationToken = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var user = await TestUsers.Create(app, "login@example.invalid");
        using var client = app.CreateApiClient();

        using var response = await client.PostAsJsonAsync(
            "/v2/auth/login",
            new { Email = user.Email, Password = TestUsers.Password },
            cancellationToken
        );

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
        Assert.True(cookie.Secure);
        Assert.True(cookie.HttpOnly);
        Assert.Equal(SameSiteMode.Strict, cookie.SameSite);
        Assert.Equal("/", cookie.Path.Value);
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
            Assert.NotNull(stored.RefreshTokenExpiry);
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(cancellationToken));
        });
        Assert.Empty(app.Transport.Messages);
    }
}
