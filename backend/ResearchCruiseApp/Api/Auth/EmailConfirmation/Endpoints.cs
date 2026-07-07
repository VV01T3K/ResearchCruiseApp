using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Results;

namespace ResearchCruiseApp.Api.Auth;

public static class EmailConfirmationEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        MapConfirm(group);
        MapResend(group);
    }

    private static void MapConfirm(RouteGroupBuilder group)
    {
        group
            .MapGet("/confirm-email", Confirm)
            .WithName("ConfirmEmailV2")
            .WithSummary("Confirm an account email.")
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status429TooManyRequests)
            .RequireRateLimiting(RateLimitingPolicies.AuthSensitive);
    }

    private static void MapResend(RouteGroupBuilder group)
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

    private static async Task<Results<NoContent, ProblemHttpResult>> Confirm(
        [AsParameters] ConfirmEmailRequest request,
        HttpContext httpContext,
        IdentityService identityService
    )
    {
        if (httpContext.Request.Query.ContainsKey("changedEmail"))
            return TypedResults.Problem(
                detail: "Query parameter 'changedEmail' is no longer supported.",
                statusCode: StatusCodes.Status400BadRequest
            );

        var result = await identityService.ConfirmEmail(request.UserId, request.Code);
        return result.IsSuccess ? TypedResults.NoContent() : result.Error!.ToProblemHttpResult();
    }

    private static async Task<NoContent> Resend(
        ResendConfirmationEmailRequest request,
        IdentityService identityService
    )
    {
        await identityService.ResendEmailConfirmationEmail(request.Email, RoleName.CruiseManager);
        return TypedResults.NoContent();
    }
}
