using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging.Abstractions;
using NeoSmart.Utils;
using ResearchCruiseApp.Api.Auth;
using ResearchCruiseApp.Infrastructure.Identity;
using ResearchCruiseApp.Infrastructure.Identity.Contracts;
using ResearchCruiseApp.Infrastructure.Persistence;
using Xunit;

namespace ResearchCruiseApp.Tests;

public sealed class AuthSessionContractTests
{
    private static readonly JsonSerializerOptions WebJsonOptions = new(JsonSerializerDefaults.Web);

    [Fact]
    public void BrowserTokenResponseNeverExposesTheRefreshCredential()
    {
        var response = new TokenResponse(
            "access-token",
            DateTime.UtcNow,
            DateTime.UtcNow.AddHours(2)
        );
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

    [Fact]
    public async Task PasswordResetRevokesTheStoredRefreshSession()
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddDataProtection();
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseInMemoryDatabase(Guid.NewGuid().ToString())
        );
        services
            .AddIdentityCore<User>()
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        await using var provider = services.BuildServiceProvider();
        await using var scope = provider.CreateAsyncScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var user = new User
        {
            UserName = "reset@example.com",
            Email = "reset@example.com",
            FirstName = "Reset",
            LastName = "User",
            RefreshToken = "stolen-refresh-token",
            RefreshTokenExpiry = DateTime.UtcNow.AddDays(1),
        };
        await userManager.CreateAsync(user, "OldPassword1!");
        var resetCode = await userManager.GeneratePasswordResetTokenAsync(user);
        var identityService = new IdentityService(
            userManager,
            roleManager,
            null!,
            null!,
            null!,
            new ConfigurationBuilder().Build(),
            dbContext,
            NullLogger<IdentityService>.Instance
        );

        var result = await identityService.ResetPassword(
            new ResetPasswordFormDto
            {
                EmailBase64 = UrlBase64.Encode(Encoding.UTF8.GetBytes(user.Email)),
                ResetCode = UrlBase64.Encode(Encoding.UTF8.GetBytes(resetCode)),
                Password = "NewPassword1!",
                PasswordConfirm = "NewPassword1!",
            }
        );
        var resetUser = await userManager.FindByIdAsync(user.Id);

        Assert.True(result.IsSuccess);
        Assert.Null(resetUser!.RefreshToken);
        Assert.Null(resetUser.RefreshTokenExpiry);
    }
}
