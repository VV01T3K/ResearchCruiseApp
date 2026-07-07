using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Infrastructure.Identity.Contracts;
using ResearchCruiseApp.Results;

namespace ResearchCruiseApp.Api.Account;

public static class PasswordEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapPatch("/me/password", Handle)
            .WithName("ChangeCurrentUserPasswordV2")
            .WithSummary("Change the current account password.")
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .WithRequestValidation<ChangePasswordRequest>()
            .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);
    }

    private static async Task<Results<NoContent, ProblemHttpResult>> Handle(
        ChangePasswordRequest request,
        IdentityService identityService
    )
    {
        var result = await identityService.ChangePassword(
            new ChangePasswordFormDto
            {
                Password = request.Password,
                NewPassword = request.NewPassword,
            }
        );

        return result.IsSuccess ? TypedResults.NoContent() : result.Error!.ToProblemHttpResult();
    }
}
