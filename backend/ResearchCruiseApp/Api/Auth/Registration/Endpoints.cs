using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Domain.Common.Constants;
using ResearchCruiseApp.Infrastructure.Identity.Contracts;
using ResearchCruiseApp.Results;

namespace ResearchCruiseApp.Api.Auth;

public static class RegistrationEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapPost("/register", Handle)
            .WithName("RegisterAccountV2")
            .WithSummary("Register a new account.")
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status429TooManyRequests)
            .WithRequestValidation<RegisterAccountRequest>()
            .RequireRateLimiting(RateLimitingPolicies.AuthSensitive);
    }

    private static async Task<Results<Created, ProblemHttpResult>> Handle(
        RegisterAccountRequest request,
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
