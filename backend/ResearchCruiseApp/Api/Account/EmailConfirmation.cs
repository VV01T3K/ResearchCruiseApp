using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Application.Common.Constants;
using ResearchCruiseApp.Application.ExternalServices;

namespace ResearchCruiseApp.Api.Account;

public static class EmailConfirmation
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapGet("/confirm-email", Confirm)
            .WithName("ConfirmEmailV2")
            .WithSummary("Confirm an account email.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status429TooManyRequests)
            .RequireRateLimiting(RateLimitingPolicies.AuthSensitive);

        group
            .MapPost("/resend-confirmation-email", Resend)
            .WithName("ResendConfirmationEmailV2")
            .WithSummary("Resend an account confirmation email.")
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status429TooManyRequests)
            .WithRequestValidation<ResendConfirmationEmailRequest>()
            .RequireRateLimiting(RateLimitingPolicies.AuthSensitive);
    }

    private static async Task<Results<NoContent, ProblemHttpResult>> Confirm(
        Guid userId,
        string code,
        string? changedEmail,
        IIdentityService identityService
    )
    {
        var result = await identityService.ConfirmEmail(userId, code, changedEmail);
        return result.IsSuccess ? TypedResults.NoContent() : result.Error!.ToProblemHttpResult();
    }

    private static async Task<NoContent> Resend(
        ResendConfirmationEmailRequest request,
        IIdentityService identityService
    )
    {
        await identityService.ResendEmailConfirmationEmail(request.Email, RoleName.CruiseManager);
        return TypedResults.NoContent();
    }
}

public sealed record ResendConfirmationEmailRequest(string Email);

public sealed class ResendConfirmationEmailRequestValidator
    : AbstractValidator<ResendConfirmationEmailRequest>
{
    public ResendConfirmationEmailRequestValidator()
    {
        RuleFor(request => request.Email).NotEmpty().EmailAddress();
    }
}
