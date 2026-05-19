using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Infrastructure.Identity.Contracts;
using ResearchCruiseApp.Infrastructure.Identity.Permissions;
using ResearchCruiseApp.Results;

namespace ResearchCruiseApp.Api.Auth;

public static class PasswordEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        MapChange(group);
        MapRequestReset(group);
        MapReset(group);
    }

    private static void MapChange(RouteGroupBuilder group)
    {
        group
            .MapPatch("/password", Change)
            .WithName("ChangeCurrentUserPasswordV2")
            .WithSummary("Change the current account password.")
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .WithRequestValidation<ChangePasswordRequest>()
            .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);
    }

    private static void MapRequestReset(RouteGroupBuilder group)
    {
        group
            .MapPost("/password-reset-request", RequestReset)
            .WithName("RequestPasswordResetV2")
            .WithSummary("Request a password reset email.")
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status429TooManyRequests)
            .WithRequestValidation<RequestPasswordResetRequest>()
            .RequireRateLimiting(RateLimitingPolicies.AuthSensitive);
    }

    private static void MapReset(RouteGroupBuilder group)
    {
        group
            .MapPost("/password-reset", Reset)
            .WithName("ResetPasswordV2")
            .WithSummary("Reset an account password.")
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status429TooManyRequests)
            .WithRequestValidation<ResetPasswordRequest>()
            .RequireRateLimiting(RateLimitingPolicies.AuthSensitive);
    }

    private static async Task<Results<NoContent, ProblemHttpResult>> Change(
        ChangePasswordRequest request,
        IIdentityService identityService
    )
    {
        var result = await identityService.ChangePassword(
            new ChangePasswordFormDto
            {
                Password = request.Password,
                NewPassword = request.NewPassword,
            }
        );

        return result.IsSuccess ? TypedResults.NoContent() : result.Error!.ToProblemHttpResult();
    }

    private static async Task<NoContent> RequestReset(
        RequestPasswordResetRequest request,
        IIdentityService identityService
    )
    {
        await identityService.EnablePasswordReset(new ForgotPasswordFormDto { Email = request.Email });
        return TypedResults.NoContent();
    }

    private static async Task<Results<NoContent, ProblemHttpResult>> Reset(
        ResetPasswordRequest request,
        IIdentityService identityService
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
