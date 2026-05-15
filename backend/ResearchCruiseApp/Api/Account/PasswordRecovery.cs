using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.Models.DTOs.Account;

namespace ResearchCruiseApp.Api.Account;

public static class PasswordRecovery
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapPost("/password-reset-request", RequestReset)
            .WithName("RequestPasswordResetV2")
            .WithSummary("Request a password reset email.")
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status429TooManyRequests)
            .WithRequestValidation<PasswordResetRequest>()
            .RequireRateLimiting(RateLimitingPolicies.AuthSensitive);

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

    private static async Task<NoContent> RequestReset(
        PasswordResetRequest request,
        IIdentityService identityService
    )
    {
        await identityService.EnablePasswordReset(
            new ForgotPasswordFormDto { Email = request.Email }
        );

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

public sealed record PasswordResetRequest(string Email);

public sealed class PasswordResetRequestValidator : AbstractValidator<PasswordResetRequest>
{
    public PasswordResetRequestValidator()
    {
        RuleFor(request => request.Email).NotEmpty().EmailAddress();
    }
}

public sealed record ResetPasswordRequest(
    string EmailBase64,
    string ResetCode,
    string Password,
    string PasswordConfirm
);

public sealed class ResetPasswordRequestValidator : AbstractValidator<ResetPasswordRequest>
{
    public ResetPasswordRequestValidator()
    {
        RuleFor(request => request.EmailBase64).NotEmpty();
        RuleFor(request => request.ResetCode).NotEmpty();
        RuleFor(request => request.Password).NotEmpty();
        RuleFor(request => request.PasswordConfirm).Equal(request => request.Password);
    }
}
