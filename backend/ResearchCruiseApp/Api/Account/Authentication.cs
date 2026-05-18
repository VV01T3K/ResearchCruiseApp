using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Api.Account.Contracts;
using ResearchCruiseApp.Api.Common.ServiceResult;

namespace ResearchCruiseApp.Api.Account;

public static class Authentication
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapPost("/login", Login)
            .WithName("LoginV2")
            .WithSummary("Sign in with an account.")
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status429TooManyRequests)
            .WithRequestValidation<LoginRequest>()
            .RequireRateLimiting(RateLimitingPolicies.AuthSensitive);

        group
            .MapPost("/refresh", Refresh)
            .WithName("RefreshTokensV2")
            .WithSummary("Refresh account tokens.")
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status429TooManyRequests)
            .WithRequestValidation<RefreshRequest>()
            .RequireRateLimiting(RateLimitingPolicies.AuthSensitive);
    }

    private static async Task<Results<Ok<AuthResponse>, ProblemHttpResult>> Login(
        LoginRequest request,
        IIdentityService identityService
    )
    {
        if (!await identityService.CanUserLogin(request.Email, request.Password))
        {
            return Error.UnknownIdentity().ToProblemHttpResult();
        }

        var result = await identityService.LoginUser(request.Email);
        return result.IsSuccess
            ? TypedResults.Ok(AuthResponse.From(result.Data!))
            : result.Error!.ToProblemHttpResult();
    }

    private static async Task<Results<Ok<AuthResponse>, ProblemHttpResult>> Refresh(
        RefreshRequest request,
        IIdentityService identityService
    )
    {
        var result = await identityService.RefreshUserTokens(
            new RefreshDto
            {
                AccessToken = request.AccessToken,
                RefreshToken = request.RefreshToken,
            }
        );

        return result.IsSuccess
            ? TypedResults.Ok(AuthResponse.From(result.Data!))
            : result.Error!.ToProblemHttpResult();
    }
}

public sealed record LoginRequest(string Email, string Password);

public sealed class LoginRequestValidator : AbstractValidator<LoginRequest>
{
    public LoginRequestValidator()
    {
        RuleFor(request => request.Email).NotEmpty().EmailAddress();
        RuleFor(request => request.Password).NotEmpty();
    }
}

public sealed record RefreshRequest(string AccessToken, string RefreshToken);

public sealed class RefreshRequestValidator : AbstractValidator<RefreshRequest>
{
    public RefreshRequestValidator()
    {
        RuleFor(request => request.AccessToken).NotEmpty();
        RuleFor(request => request.RefreshToken).NotEmpty();
    }
}

public sealed record AuthResponse(
    string AccessToken,
    DateTime AccessTokenExpirationDate,
    string RefreshToken,
    DateTime RefreshTokenExpirationDate
)
{
    public static AuthResponse From(LoginResponseDto response)
    {
        return new AuthResponse(
            response.AccessToken,
            response.AccessTokenExpirationDate,
            response.RefreshToken,
            response.RefreshTokenExpirationDate
        );
    }
}
