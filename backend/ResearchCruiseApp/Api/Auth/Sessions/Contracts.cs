using ResearchCruiseApp.Infrastructure.Identity.Contracts;

namespace ResearchCruiseApp.Api.Auth;

public sealed record LoginRequest(string Email, string Password);

public sealed record TokenResponse(
    string AccessToken,
    DateTime AccessTokenExpirationDate,
    DateTime RefreshTokenExpirationDate
)
{
    public static TokenResponse From(LoginResponseDto response)
    {
        return new TokenResponse(
            response.AccessToken,
            response.AccessTokenExpirationDate,
            response.RefreshTokenExpirationDate
        );
    }
}
