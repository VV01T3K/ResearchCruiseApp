using System.Text.Json;
using Microsoft.AspNetCore.Http;
using ResearchCruiseApp.Api.Auth;
using Xunit;

namespace ResearchCruiseApp.Tests;

public sealed class AuthSessionContractTests
{
    private static readonly JsonSerializerOptions WebJsonOptions = new(JsonSerializerDefaults.Web);

    [Fact]
    public void BrowserTokenResponseNeverExposesTheRefreshCredential()
    {
        var response = new TokenResponse("access-token", DateTime.UtcNow, DateTime.UtcNow.AddHours(2));
        var json = JsonSerializer.SerializeToElement(response, WebJsonOptions);

        Assert.Equal("access-token", json.GetProperty("accessToken").GetString());
        Assert.True(json.TryGetProperty("refreshTokenExpirationDate", out _));
        Assert.False(json.TryGetProperty("refreshToken", out _));
    }

    [Fact]
    public void RefreshCookieIsRestrictedToTheAuthApiAndJavaScriptCannotReadIt()
    {
        var expiration = DateTime.UtcNow.AddHours(2);
        var production = SessionsEndpoints.CreateRefreshTokenCookieOptions(false, expiration);
        var development = SessionsEndpoints.CreateRefreshTokenCookieOptions(true, expiration);

        Assert.True(production.HttpOnly);
        Assert.True(production.Secure);
        Assert.Equal(SameSiteMode.Strict, production.SameSite);
        Assert.Equal("/v2/auth", production.Path);
        Assert.Equal(expiration, production.Expires);
        Assert.False(development.Secure);
    }
}
