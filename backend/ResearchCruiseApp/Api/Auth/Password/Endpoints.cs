using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Infrastructure.Identity.Contracts;

namespace ResearchCruiseApp.Api.Auth;

public static class PasswordEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        MapRequestReset(group);
        MapReset(group);
    }

    private static void MapRequestReset(RouteGroupBuilder group)
    {
        group
            .MapPost("/password-reset-request", RequestReset)
            .WithName("RequestPasswordReset")
            .WithSummary("Request a password reset email.")
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status429TooManyRequests)
            .WithRequestValidation<RequestPasswordResetRequest>()
            .RequireRateLimiting(RateLimitingPolicies.AuthSensitive)
            .AllowAnonymous();
    }

    private static void MapReset(RouteGroupBuilder group)
    {
        group
            .MapPost("/password-reset", Reset)
            .WithName("ResetPassword")
            .WithSummary("Reset an account password.")
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status429TooManyRequests)
            .WithRequestValidation<ResetPasswordRequest>()
            .RequireRateLimiting(RateLimitingPolicies.AuthSensitive)
            .AllowAnonymous();
    }

    private static async Task<NoContent> RequestReset(
        RequestPasswordResetRequest request,
        IdentityService identityService
    )
    {
        await identityService.EnablePasswordReset(
            new ForgotPasswordFormDto { Email = request.Email }
        );
        return TypedResults.NoContent();
    }

    private static async Task<Results<NoContent, ProblemHttpResult>> Reset(
        ResetPasswordRequest request,
        IdentityService identityService
    )
    {
        var result = await identityService.ResetPassword(
            new ResetPasswordFormDto
            {
                EmailBase64 = request.EmailBase64,
                ResetCode = request.ResetCode,
                Password = request.Password,
                PasswordConfirm = request.PasswordConfirm,
            }
        );

        return result.IsSuccess ? TypedResults.NoContent() : result.Error!.ToProblemHttpResult();
    }
}
