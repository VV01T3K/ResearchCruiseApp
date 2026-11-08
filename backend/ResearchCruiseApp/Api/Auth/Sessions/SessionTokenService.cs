using System.IdentityModel.Tokens.Jwt;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Infrastructure.Identity.Contracts;

namespace ResearchCruiseApp.Api.Auth;

internal class SessionTokenService(
    UserManager<User> userManager,
    RandomGenerator randomGenerator,
    IOptions<JwtSettings> jwtSettings,
    TimeProvider clock
)
{
    public async Task<bool> CanUserLogin(string email, string password)
    {
        var user = await userManager.FindByEmailAsync(email);
        return user is { Accepted: true, EmailConfirmed: true }
            && await userManager.CheckPasswordAsync(user, password);
    }

    public async Task<Result<LoginResponseDto>> LoginUser(string userEmail)
    {
        var user = await userManager.FindByEmailAsync(userEmail);
        if (user is null)
            return Error.UnknownIdentity();

        return await CreateLoginResponseDto(user);
    }

    public async Task<Result<LoginResponseDto>> RefreshUserTokens(string refreshToken)
    {
        if (string.IsNullOrWhiteSpace(refreshToken))
            return Error.UnknownIdentity();

        var refreshTokenHash = HashRefreshToken(refreshToken);
        var user = await userManager.Users.SingleOrDefaultAsync(candidate =>
            candidate.RefreshToken == refreshTokenHash
        );
        if (
            user is null
            || !user.Accepted
            || !user.EmailConfirmed
            || user.RefreshTokenExpiry is null
            || user.RefreshTokenExpiry < clock.GetUtcNow().UtcDateTime
        )
            return Error.UnknownIdentity();

        return await CreateLoginResponseDto(user);
    }

    public async Task RevokeRefreshToken(string refreshToken)
    {
        var refreshTokenHash = HashRefreshToken(refreshToken);
        await RevokeRefreshToken(user => user.RefreshToken == refreshTokenHash);
    }

    public async Task RevokeRefreshToken(Guid userId)
    {
        await RevokeRefreshToken(user => user.Id == userId.ToString());
    }

    private async Task RevokeRefreshToken(Expression<Func<User, bool>> userPredicate)
    {
        await userManager
            .Users.Where(userPredicate)
            .ExecuteUpdateAsync(properties =>
                properties
                    .SetProperty(user => user.RefreshToken, (string?)null)
                    .SetProperty(user => user.RefreshTokenExpiry, (DateTime?)null)
                    .SetProperty(user => user.ConcurrencyStamp, Guid.NewGuid().ToString())
            );
    }

    private async Task<Result<LoginResponseDto>> CreateLoginResponseDto(User user)
    {
        var accessTokenResult = await CreateAccessToken(user);
        if (!accessTokenResult.IsSuccess)
            return accessTokenResult.Error!;
        var accessToken = accessTokenResult.Data;

        var (refreshToken, refreshTokenExpiry) = CreateRefreshToken();

        user.RefreshToken = HashRefreshToken(refreshToken);
        user.RefreshTokenExpiry = refreshTokenExpiry;

        var identityResult = await userManager.UpdateAsync(user);
        var concurrencyError = identityResult.Errors.FirstOrDefault(error =>
            error.Code == nameof(IdentityErrorDescriber.ConcurrencyFailure)
        );

        if (concurrencyError is not null)
            return Error.Conflict("Wykonano wiele żądań w zbyt krótkim odstępie czasowym.");
        if (!identityResult.Succeeded)
            return Error.ServerError();

        var loginResponseDto = new LoginResponseDto
        {
            AccessToken = new JwtSecurityTokenHandler().WriteToken(accessToken),
            AccessTokenExpirationDate = accessToken?.ValidTo ?? clock.GetUtcNow().UtcDateTime,
            RefreshToken = refreshToken,
            RefreshTokenExpirationDate = refreshTokenExpiry.ToUniversalTime(),
        };
        return loginResponseDto;
    }

    private async Task<Result<JwtSecurityToken>> CreateAccessToken(User user)
    {
        var settings = jwtSettings.Value;
        var authenticationClaims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };

        var roles = await userManager.GetRolesAsync(user);
        authenticationClaims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(settings.Secret));
        var token = new JwtSecurityToken(
            issuer: settings.ValidIssuer,
            audience: settings.ValidAudience,
            expires: clock.GetUtcNow().UtcDateTime.AddSeconds(settings.AccessTokenLifetimeSeconds),
            claims: authenticationClaims,
            signingCredentials: new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256)
        );

        return token;
    }

    private (string token, DateTime expiry) CreateRefreshToken()
    {
        var expiry = clock
            .GetUtcNow()
            .UtcDateTime.AddSeconds(jwtSettings.Value.RefreshTokenLifetimeSeconds);
        var token = Convert.ToBase64String(randomGenerator.CreateSecureCodeBytes());

        return (token, expiry);
    }

    private static string HashRefreshToken(string refreshToken)
    {
        return Convert.ToBase64String(SHA256.HashData(Encoding.UTF8.GetBytes(refreshToken)));
    }
}
