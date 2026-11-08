using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using ResearchCruiseApp.Domain;

namespace ResearchCruiseApp.Api.Users;

public static class PasswordEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapPatch("/password", Handle)
            .WithName("ChangeCurrentUserPassword")
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
        CurrentUserService currentUserService,
        UserManager<User> userManager
    )
    {
        var userId = currentUserService.GetId();
        if (userId is null)
            return Error.ResourceNotFound().ToProblemHttpResult();

        var user = await userManager.FindByIdAsync(userId.ToString()!);
        if (user is null)
            return Error.ResourceNotFound().ToProblemHttpResult();

        var identityResult = await userManager.ChangePasswordAsync(
            user,
            request.Password,
            request.NewPassword
        );

        if (!identityResult.Succeeded)
            return Error.InvalidArgument().ToProblemHttpResult();

        user.RefreshToken = null;
        user.RefreshTokenExpiry = null;
        await userManager.UpdateAsync(user);
        return TypedResults.NoContent();
    }
}
