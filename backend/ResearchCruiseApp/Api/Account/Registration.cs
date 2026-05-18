using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Api.Account.Contracts;
using ResearchCruiseApp.Api.Common.Constants;

namespace ResearchCruiseApp.Api.Account;

public static class Registration
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapPost("/register", Register)
            .WithName("RegisterAccountV2")
            .WithSummary("Register a new account.")
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status429TooManyRequests)
            .WithRequestValidation<RegisterRequest>()
            .RequireRateLimiting(RateLimitingPolicies.AuthSensitive);
    }

    private static async Task<Results<Created, ProblemHttpResult>> Register(
        RegisterRequest request,
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
}

public sealed record RegisterRequest(
    string Email,
    string Password,
    string FirstName,
    string LastName
);

public sealed class RegisterRequestValidator : AbstractValidator<RegisterRequest>
{
    public RegisterRequestValidator()
    {
        RuleFor(request => request.Email).NotEmpty().EmailAddress();
        RuleFor(request => request.Password).NotEmpty();
        RuleFor(request => request.FirstName).NotEmpty();
        RuleFor(request => request.LastName).NotEmpty();
    }
}
