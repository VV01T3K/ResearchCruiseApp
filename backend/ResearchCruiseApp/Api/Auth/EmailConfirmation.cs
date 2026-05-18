using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Domain.Common.Constants;
using ResearchCruiseApp.Results;

namespace ResearchCruiseApp.Api.Auth;

public static class EmailConfirmation
{
    public static void Map(RouteGroupBuilder group)
    {
        Confirm.Map(group);
        Resend.Map(group);
    }

    public static class Confirm
    {
        public static void Map(RouteGroupBuilder group)
        {
            group
                .MapGet("/confirm-email", Handle)
                .WithName("ConfirmEmailV2")
                .WithSummary("Confirm an account email.")
                .ProducesProblem(StatusCodes.Status400BadRequest)
                .ProducesProblem(StatusCodes.Status401Unauthorized)
                .ProducesProblem(StatusCodes.Status429TooManyRequests)
                .RequireRateLimiting(RateLimitingPolicies.AuthSensitive);
        }

        private static async Task<Results<NoContent, ProblemHttpResult>> Handle(
            Request request,
            HttpContext httpContext,
            IIdentityService identityService
        )
        {
            if (httpContext.Request.Query.ContainsKey("changedEmail"))
                return TypedResults.Problem(
                    detail: "Query parameter 'changedEmail' is no longer supported.",
                    statusCode: StatusCodes.Status400BadRequest
                );

            var result = await identityService.ConfirmEmail(request.UserId, request.Code);
            return result.IsSuccess
                ? TypedResults.NoContent()
                : result.Error!.ToProblemHttpResult();
        }

        public sealed record Request(Guid UserId, string Code);
    }

    public static class Resend
    {
        public static void Map(RouteGroupBuilder group)
        {
            group
                .MapPost("/resend-confirmation-email", Handle)
                .WithName("ResendConfirmationEmailV2")
                .WithSummary("Resend an account confirmation email.")
                .ProducesValidationProblem()
                .ProducesProblem(StatusCodes.Status429TooManyRequests)
                .WithRequestValidation<Request>()
                .RequireRateLimiting(RateLimitingPolicies.AuthSensitive);
        }

        private static async Task<NoContent> Handle(
            Request request,
            IIdentityService identityService
        )
        {
            await identityService.ResendEmailConfirmationEmail(
                request.Email,
                RoleName.CruiseManager
            );
            return TypedResults.NoContent();
        }

        public sealed record Request(string Email);

        public sealed class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(request => request.Email).NotEmpty().EmailAddress();
            }
        }
    }
}
