using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Infrastructure.Identity.Contracts;

namespace ResearchCruiseApp.Api.Auth;

public static class SessionsEndpoints
{
    private const string RefreshTokenCookie = "rca_refresh_token";
    private const string RefreshTokenCookiePath = "/v2/auth";

    public static void Map(RouteGroupBuilder group)
    {
        MapLogin(group);
        MapRefresh(group);
        MapLogout(group);
    }

    private static void MapLogin(RouteGroupBuilder group)
    {
        group
            .MapPost("/login", Login)
            .WithName("Login")
            .WithSummary("Sign in with an account.")
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status429TooManyRequests)
            .WithRequestValidation<LoginRequest>()
            .RequireRateLimiting(RateLimitingPolicies.AuthSensitive)
            .AllowAnonymous();
    }

    private static void MapRefresh(RouteGroupBuilder group)
    {
        group
            .MapPost("/refresh", Refresh)
            .WithName("RefreshTokens")
            .WithSummary("Refresh account tokens.")
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status429TooManyRequests)
            .RequireRateLimiting(RateLimitingPolicies.AuthSensitive)
            .AllowAnonymous();
    }

    private static void MapLogout(RouteGroupBuilder group)
    {
        group
            .MapPost("/logout", Logout)
            .WithName("Logout")
            .WithSummary("Revoke the current refresh session.")
            .Produces(StatusCodes.Status204NoContent)
            .ProducesProblem(StatusCodes.Status429TooManyRequests)
            .RequireRateLimiting(RateLimitingPolicies.AuthSensitive)
            .AllowAnonymous();
    }

    private static async Task<Results<Ok<TokenResponse>, ProblemHttpResult>> Login(
        LoginRequest request,
        IdentityService identityService,
        HttpContext context,
        IWebHostEnvironment environment
    )
    {
        if (!await identityService.CanUserLogin(request.Email, request.Password))
        {
            return Error.UnknownIdentity().ToProblemHttpResult();
        }

        var result = await identityService.LoginUser(request.Email);
        if (!result.IsSuccess)
            return result.Error!.ToProblemHttpResult();

        WriteRefreshTokenCookie(context, environment, result.Data!);
        return TypedResults.Ok(TokenResponse.From(result.Data!));
    }

    private static async Task<Results<Ok<TokenResponse>, ProblemHttpResult>> Refresh(
        IdentityService identityService,
        HttpContext context,
        IWebHostEnvironment environment
    )
    {
        if (!context.Request.Cookies.TryGetValue(RefreshTokenCookie, out var refreshToken))
            return Error.UnknownIdentity().ToProblemHttpResult();

        var result = await identityService.RefreshUserTokens(refreshToken);

        if (!result.IsSuccess)
            return result.Error!.ToProblemHttpResult();

        WriteRefreshTokenCookie(context, environment, result.Data!);
        return TypedResults.Ok(TokenResponse.From(result.Data!));
    }

    private static async Task<NoContent> Logout(
        IdentityService identityService,
        HttpContext context,
        IWebHostEnvironment environment
    )
    {
        if (
            context.Request.Cookies.TryGetValue(RefreshTokenCookie, out var refreshToken)
            && !string.IsNullOrWhiteSpace(refreshToken)
        )
            await identityService.RevokeRefreshToken(refreshToken);

        context.Response.Cookies.Delete(
            RefreshTokenCookie,
            CreateRefreshTokenCookieOptions(environment.IsDevelopment())
        );
        return TypedResults.NoContent();
    }

    private static void WriteRefreshTokenCookie(
        HttpContext context,
        IWebHostEnvironment environment,
        LoginResponseDto response
    )
    {
        context.Response.Cookies.Append(
            RefreshTokenCookie,
            response.RefreshToken,
            CreateRefreshTokenCookieOptions(
                environment.IsDevelopment(),
                response.RefreshTokenExpirationDate
            )
        );
    }

    internal static CookieOptions CreateRefreshTokenCookieOptions(
        bool isDevelopment,
        DateTime? expires = null
    ) =>
        new()
        {
            HttpOnly = true,
            Secure = !isDevelopment,
            SameSite = SameSiteMode.Strict,
            Path = RefreshTokenCookiePath,
            Expires = expires,
            IsEssential = true,
        };
}
