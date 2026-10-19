using System.Text;
using Microsoft.AspNetCore.Http.HttpResults;
using NeoSmart.Utils;
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
            .WithRequestValidation<RequestPasswordResetRequest>()
            .WithAccountRateLimit<RequestPasswordResetRequest>(
                RateLimitingPolicies.AccountEmail,
                request => request.Email
            )
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
            .WithRequestValidation<ResetPasswordRequest>()
            .WithAccountRateLimit<ResetPasswordRequest>(
                RateLimitingPolicies.AccountEmail,
                request => Encoding.UTF8.GetString(UrlBase64.Decode(request.EmailBase64) ?? [])
            )
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
