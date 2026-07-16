using System.Text.Json;
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
}
