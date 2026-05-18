using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Infrastructure.Identity.Contracts;

namespace ResearchCruiseApp.Api.Auth;

public static class Password
{
    public static void Map(RouteGroupBuilder group)
    {
        Change.Map(group);
        RequestReset.Map(group);
        Reset.Map(group);
    }

    public static class Change
    {
        public static void Map(RouteGroupBuilder group)
        {
            group
                .MapPatch("/password", Handle)
                .WithName("ChangeCurrentUserPasswordV2")
                .WithSummary("Change the current account password.")
                .ProducesValidationProblem()
                .ProducesProblem(StatusCodes.Status400BadRequest)
                .ProducesProblem(StatusCodes.Status401Unauthorized)
                .ProducesProblem(StatusCodes.Status404NotFound)
                .WithRequestValidation<Request>()
                .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);
        }

        private static async Task<Results<NoContent, ProblemHttpResult>> Handle(
            Request request,
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

            return result.IsSuccess
                ? TypedResults.NoContent()
                : result.Error!.ToProblemHttpResult();
        }

        public sealed record Request(string Password, string NewPassword);

        public sealed class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(request => request.Password).NotEmpty();
                RuleFor(request => request.NewPassword).NotEmpty();
            }
        }
    }

    public static class RequestReset
    {
        public static void Map(RouteGroupBuilder group)
        {
            group
                .MapPost("/password-reset-request", Handle)
                .WithName("RequestPasswordResetV2")
                .WithSummary("Request a password reset email.")
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
            await identityService.EnablePasswordReset(
                new ForgotPasswordFormDto { Email = request.Email }
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

    public static class Reset
    {
        public static void Map(RouteGroupBuilder group)
        {
            group
                .MapPost("/password-reset", Handle)
                .WithName("ResetPasswordV2")
                .WithSummary("Reset an account password.")
                .ProducesValidationProblem()
                .ProducesProblem(StatusCodes.Status401Unauthorized)
                .ProducesProblem(StatusCodes.Status403Forbidden)
                .ProducesProblem(StatusCodes.Status429TooManyRequests)
                .WithRequestValidation<Request>()
                .RequireRateLimiting(RateLimitingPolicies.AuthSensitive);
        }

        private static async Task<Results<NoContent, ProblemHttpResult>> Handle(
            Request request,
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

            return result.IsSuccess
                ? TypedResults.NoContent()
                : result.Error!.ToProblemHttpResult();
        }

        public sealed record Request(
            string EmailBase64,
            string ResetCode,
            string Password,
            string PasswordConfirm
        );

        public sealed class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(request => request.EmailBase64).NotEmpty();
                RuleFor(request => request.ResetCode).NotEmpty();
                RuleFor(request => request.Password).NotEmpty();
                RuleFor(request => request.PasswordConfirm).Equal(request => request.Password);
            }
        }
    }
}
