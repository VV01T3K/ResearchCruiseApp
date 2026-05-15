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
            .MapPost("/resend-confirmation-email", Resend)
            .WithName("ResendConfirmationEmailV2")
            .WithSummary("Resend an account confirmation email.")
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status429TooManyRequests)
            .WithRequestValidation<ResendConfirmationEmailRequest>()
            .RequireRateLimiting(RateLimitingPolicies.AuthSensitive);
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
