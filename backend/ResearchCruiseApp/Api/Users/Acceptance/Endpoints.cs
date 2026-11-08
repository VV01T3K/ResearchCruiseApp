using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Infrastructure.Identity.Permissions;

namespace ResearchCruiseApp.Api.Users;

public static class AcceptanceEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        MapAccept(group);
        MapDeactivate(group);
    }

    private static void MapAccept(RouteGroupBuilder group)
    {
        group
            .MapPut("/{userId:guid}/acceptance", Accept)
            .WithName("AcceptUser")
            .WithSummary("Accept a managed user.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .WithSerializableTransaction()
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
    }

    private static void MapDeactivate(RouteGroupBuilder group)
    {
        group
            .MapDelete("/{userId:guid}/acceptance", Deactivate)
            .WithName("DeactivateUser")
            .WithSummary("Deactivate a managed user.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .WithSerializableTransaction()
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
    }

    private static async Task<Results<NoContent, ProblemHttpResult>> Accept(
        Guid userId,
        UserPermissionVerifier userPermissionVerifier,
        UserManager<User> userManager,
        EmailSender emailSender
    )
    {
        if (!await userPermissionVerifier.CanCurrentUserAccess(userId))
        {
            return Error
                .ForbiddenOperation("Nie można zaakceptować tego użytkownika")
                .ToProblemHttpResult();
        }

        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null)
            return Error.ResourceNotFound().ToProblemHttpResult();

        user.Accepted = true;

        var identityResult = await userManager.UpdateAsync(user);
        if (!identityResult.Succeeded)
            return identityResult.ToApplicationResult().Error!.ToProblemHttpResult();

        await emailSender.SendAccountAcceptedMessage(await userManager.CreateUserDto(user));

        return TypedResults.NoContent();
    }

    private static async Task<Results<NoContent, ProblemHttpResult>> Deactivate(
        Guid userId,
        UserPermissionVerifier userPermissionVerifier,
        CurrentUserService currentUserService,
        UserManager<User> userManager
    )
    {
        if (currentUserService.GetId() == userId)
        {
            return Error
                .ForbiddenOperation("Nie można cofnąć akceptacji własnego konta")
                .ToProblemHttpResult();
        }

        if (!await userPermissionVerifier.CanUserDeactivate(userId))
        {
            return Error.ForbiddenOperation().ToProblemHttpResult();
        }

        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null)
            return Error.ForbiddenOperation().ToProblemHttpResult();

        user.Accepted = false;
        user.RefreshToken = null;
        user.RefreshTokenExpiry = null;

        var identityResult = await userManager.UpdateAsync(user);

        return identityResult.Succeeded
            ? TypedResults.NoContent()
            : identityResult.ToApplicationResult().Error!.ToProblemHttpResult();
    }
}
