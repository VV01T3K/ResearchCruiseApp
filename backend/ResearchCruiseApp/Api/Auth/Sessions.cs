using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Results;
using ResearchCruiseApp.Infrastructure.Identity.Contracts;

namespace ResearchCruiseApp.Api.Auth;

public static class Sessions
{
    public static void Map(RouteGroupBuilder group)
    {
        Login.Map(group);
        Refresh.Map(group);
    }

    public static class Login
    {
        public static void Map(RouteGroupBuilder group)
        {
            group
                .MapPost("/login", Handle)
                .WithName("LoginV2")
                .WithSummary("Sign in with an account.")
                .ProducesValidationProblem()
                .ProducesProblem(StatusCodes.Status401Unauthorized)
                .ProducesProblem(StatusCodes.Status429TooManyRequests)
                .WithRequestValidation<Request>()
                .RequireRateLimiting(RateLimitingPolicies.AuthSensitive);
        }

        private static async Task<Results<Ok<Response>, ProblemHttpResult>> Handle(
            Request request,
            IIdentityService identityService
        )
        {
            if (!await identityService.CanUserLogin(request.Email, request.Password))
            {
                return Error.UnknownIdentity().ToProblemHttpResult();
            }

            var result = await identityService.LoginUser(request.Email);
            return result.IsSuccess
                ? TypedResults.Ok(Response.From(result.Data!))
                : result.Error!.ToProblemHttpResult();
        }

        public sealed record Request(string Email, string Password);

        public sealed class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(request => request.Email).NotEmpty().EmailAddress();
                RuleFor(request => request.Password).NotEmpty();
            }
        }

        public sealed record Response(
            string AccessToken,
            DateTime AccessTokenExpirationDate,
            string RefreshToken,
            DateTime RefreshTokenExpirationDate
        )
        {
            public static Response From(LoginResponseDto response)
            {
                return new Response(
                    response.AccessToken,
                    response.AccessTokenExpirationDate,
                    response.RefreshToken,
                    response.RefreshTokenExpirationDate
                );
            }
        }
    }

    public static class Refresh
    {
        public static void Map(RouteGroupBuilder group)
        {
            group
                .MapPost("/refresh", Handle)
                .WithName("RefreshTokensV2")
                .WithSummary("Refresh account tokens.")
                .ProducesValidationProblem()
                .ProducesProblem(StatusCodes.Status401Unauthorized)
                .ProducesProblem(StatusCodes.Status429TooManyRequests)
                .WithRequestValidation<Request>()
                .RequireRateLimiting(RateLimitingPolicies.AuthSensitive);
        }

        private static async Task<Results<Ok<Response>, ProblemHttpResult>> Handle(
            Request request,
            IIdentityService identityService
        )
        {
            var result = await identityService.RefreshUserTokens(
                new RefreshDto
                {
                    AccessToken = request.AccessToken,
                    RefreshToken = request.RefreshToken,
                }
            );

            return result.IsSuccess
                ? TypedResults.Ok(Response.From(result.Data!))
                : result.Error!.ToProblemHttpResult();
        }

        public sealed record Request(string AccessToken, string RefreshToken);

        public sealed class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(request => request.AccessToken).NotEmpty();
                RuleFor(request => request.RefreshToken).NotEmpty();
            }
        }

        public sealed record Response(
            string AccessToken,
            DateTime AccessTokenExpirationDate,
            string RefreshToken,
            DateTime RefreshTokenExpirationDate
        )
        {
            public static Response From(LoginResponseDto response)
            {
                return new Response(
                    response.AccessToken,
                    response.AccessTokenExpirationDate,
                    response.RefreshToken,
                    response.RefreshTokenExpirationDate
                );
            }
        }
    }
}
