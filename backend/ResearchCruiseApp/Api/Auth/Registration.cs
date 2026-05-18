using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Domain.Common.Constants;
using ResearchCruiseApp.Infrastructure.Identity.Contracts;
using ResearchCruiseApp.Results;

namespace ResearchCruiseApp.Api.Auth;

public static class Registration
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapPost("/register", Handle)
            .WithName("RegisterAccountV2")
            .WithSummary("Register a new account.")
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status429TooManyRequests)
            .WithRequestValidation<Request>()
            .RequireRateLimiting(RateLimitingPolicies.AuthSensitive);
    }

    private static async Task<Results<Created, ProblemHttpResult>> Handle(
        Request request,
        IIdentityService identityService
    )
    {
        var result = await identityService.RegisterUser(
            new RegisterFormDto
            {
                Email = request.Email,
                Password = request.Password,
                FirstName = request.FirstName,
                LastName = request.LastName,
            },
            RoleName.CruiseManager
        );

        return result.IsSuccess ? TypedResults.Created() : result.Error!.ToProblemHttpResult();
    }

    public sealed record Request(string Email, string Password, string FirstName, string LastName);

    public sealed class Validator : AbstractValidator<Request>
    {
        public Validator()
        {
            RuleFor(request => request.Email).NotEmpty().EmailAddress();
            RuleFor(request => request.Password).NotEmpty();
            RuleFor(request => request.FirstName).NotEmpty();
            RuleFor(request => request.LastName).NotEmpty();
        }
    }
}
