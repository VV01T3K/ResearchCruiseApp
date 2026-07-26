using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Infrastructure.Identity.Contracts;

namespace ResearchCruiseApp.Api.Auth;

public static class SessionsEndpoints
{
    private const string RefreshTokenCookie = "rca_refresh_token";

    // The backend cannot know the browser-visible prefix: it is served bare by the vite dev server,
    // under /api/ by frontend/nginx.conf (which strips the prefix before we see the request), and
    // behind Caddy on top of that in staging. A narrower path is stored by the browser and then
    // never sent back. HttpOnly + SameSite=Strict + rotation on every use carry the security here.
    private const string RefreshTokenCookiePath = "/";

    // Cookies written by an earlier revision of this branch. Only reachable in local dev, where both
    // paths match /v2/auth/refresh and the browser would send two values for the same name.
    // Remove one release after this ships.
    private const string LegacyRefreshTokenCookiePath = "/v2/auth";

    private const string RefreshCookieSecureConfigurationKey = "Auth:RefreshCookieSecure";

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
            .RequireRateLimiting(RateLimitingPolicies.SessionRefresh)
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
            // Not AuthSensitive: sharing the login bucket meant a throttled user could not log out.
            .RequireRateLimiting(RateLimitingPolicies.SessionRefresh)
            .AllowAnonymous();
    }

    private static async Task<Results<Ok<TokenResponse>, ProblemHttpResult>> Login(
        LoginRequest request,
        IdentityService identityService,
        HttpContext context,
        IConfiguration configuration
    )
    {
        if (!await identityService.CanUserLogin(request.Email, request.Password))
        {
            return Error.UnknownIdentity().ToProblemHttpResult();
        }

        var result = await identityService.LoginUser(request.Email);
        if (!result.IsSuccess)
            return result.Error!.ToProblemHttpResult();

        DeleteLegacyRefreshTokenCookie(context, configuration);
        WriteRefreshTokenCookie(context, configuration, result.Data!);
        return TypedResults.Ok(TokenResponse.From(result.Data!));
    }

    private static async Task<Results<Ok<TokenResponse>, ProblemHttpResult>> Refresh(
        IdentityService identityService,
        HttpContext context,
        IConfiguration configuration
    )
    {
        if (!context.Request.Cookies.TryGetValue(RefreshTokenCookie, out var refreshToken))
            return Error.UnknownIdentity().ToProblemHttpResult();

        var result = await identityService.RefreshUserTokens(refreshToken);

        if (!result.IsSuccess)
            return result.Error!.ToProblemHttpResult();

        WriteRefreshTokenCookie(context, configuration, result.Data!);
        return TypedResults.Ok(TokenResponse.From(result.Data!));
    }

    private static async Task<NoContent> Logout(
        IdentityService identityService,
        CurrentUserService currentUserService,
        HttpContext context,
        IConfiguration configuration
    )
    {
        var currentUserId = currentUserService.GetId();
        if (currentUserId is not null)
        {
            await identityService.RevokeRefreshToken(currentUserId.Value);
        }
        else if (
            context.Request.Cookies.TryGetValue(RefreshTokenCookie, out var refreshToken)
            && !string.IsNullOrWhiteSpace(refreshToken)
        )
        {
            await identityService.RevokeRefreshToken(refreshToken);
        }

        context.Response.Cookies.Delete(
            RefreshTokenCookie,
            CreateRefreshTokenCookieOptions(IsRefreshCookieSecure(configuration))
        );
        // Must follow the delete above: ResponseCookies.Delete strips already-queued Set-Cookie
        // headers whose value contains "path={options.Path}", and "path=/v2/auth" starts with
        // "path=/", so deleting the current path last would drop the legacy header.
        DeleteLegacyRefreshTokenCookie(context, configuration);
        return TypedResults.NoContent();
    }

    private static void WriteRefreshTokenCookie(
        HttpContext context,
        IConfiguration configuration,
        LoginResponseDto response
    )
    {
        context.Response.Cookies.Append(
            RefreshTokenCookie,
            response.RefreshToken,
            CreateRefreshTokenCookieOptions(
                IsRefreshCookieSecure(configuration),
                response.RefreshTokenExpirationDate
            )
        );
    }

    private static void DeleteLegacyRefreshTokenCookie(
        HttpContext context,
        IConfiguration configuration
    )
    {
        var options = CreateRefreshTokenCookieOptions(IsRefreshCookieSecure(configuration));
        options.Path = LegacyRefreshTokenCookiePath;
        context.Response.Cookies.Delete(RefreshTokenCookie, options);
    }

    // Defaults to true so a stray ASPNETCORE_ENVIRONMENT=Development cannot silently drop Secure in
    // a deployed environment. Only appsettings.Development.json opts out.
    private static bool IsRefreshCookieSecure(IConfiguration configuration) =>
        configuration.GetValue(RefreshCookieSecureConfigurationKey, true);

    internal static CookieOptions CreateRefreshTokenCookieOptions(
        bool secure,
        DateTime? expires = null
    ) =>
        new()
        {
            HttpOnly = true,
            Secure = secure,
            SameSite = SameSiteMode.Strict,
            Path = RefreshTokenCookiePath,
            Expires = expires,
            IsEssential = true,
        };
}
