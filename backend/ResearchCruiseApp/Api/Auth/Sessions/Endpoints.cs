using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Infrastructure.Identity.Contracts;
using ResearchCruiseApp.Results;

namespace ResearchCruiseApp.Api.Auth;

public static class SessionsEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        MapLogin(group);
        MapRefresh(group);
    }

    private static void MapLogin(RouteGroupBuilder group)
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
    }

    private static void MapRefresh(RouteGroupBuilder group)
    {
        group
            .MapPost("/refresh", Refresh)
            .WithName("RefreshTokensV2")
            .WithSummary("Refresh account tokens.")
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status429TooManyRequests)
            .WithRequestValidation<RefreshTokensRequest>()
            .RequireRateLimiting(RateLimitingPolicies.AuthSensitive);
    }

    private static async Task<Results<Ok<TokenResponse>, ProblemHttpResult>> Login(
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
            ? TypedResults.Ok(TokenResponse.From(result.Data!))
            : result.Error!.ToProblemHttpResult();
    }

    private static async Task<Results<Ok<TokenResponse>, ProblemHttpResult>> Refresh(
        RefreshTokensRequest request,
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
            ? TypedResults.Ok(TokenResponse.From(result.Data!))
            : result.Error!.ToProblemHttpResult();
    }
}
