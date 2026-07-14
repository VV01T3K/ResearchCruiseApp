using Microsoft.AspNetCore.Http.HttpResults;
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
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
    }

    private static async Task<Results<NoContent, ProblemHttpResult>> Accept(
        Guid userId,
        UserPermissionVerifier userPermissionVerifier,
        IdentityService identityService
    )
    {
        if (!await userPermissionVerifier.CanCurrentUserAccess(userId))
        {
            return Error
                .ForbiddenOperation("Nie można zaakceptować tego użytkownika")
                .ToProblemHttpResult();
        }

        var result = await identityService.AcceptUser(userId);
        return result.IsSuccess ? TypedResults.NoContent() : result.Error!.ToProblemHttpResult();
    }

    private static async Task<Results<NoContent, ProblemHttpResult>> Deactivate(
        Guid userId,
        UserPermissionVerifier userPermissionVerifier,
        IdentityService identityService
    )
    {
        if (!await userPermissionVerifier.CanUserDeactivate(userId))
        {
            return Error.ForbiddenOperation().ToProblemHttpResult();
        }

        var result = await identityService.DeactivateUser(userId);
        return result.IsSuccess ? TypedResults.NoContent() : result.Error!.ToProblemHttpResult();
    }
}
