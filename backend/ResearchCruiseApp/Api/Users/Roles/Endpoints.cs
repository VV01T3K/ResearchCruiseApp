using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Infrastructure.Identity.Permissions;

namespace ResearchCruiseApp.Api.Users;

public static class RolesEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        MapAdd(group);
        MapRemove(group);
    }

    private static void MapAdd(RouteGroupBuilder group)
    {
        group
            .MapPut("/{userId:guid}/roles/{roleName}", Add)
            .WithName("AddUserRole")
            .WithSummary("Add a role to a managed user.")
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
    }

    private static void MapRemove(RouteGroupBuilder group)
    {
        group
            .MapDelete("/{userId:guid}/roles/{roleName}", Remove)
            .WithName("RemoveUserRole")
            .WithSummary("Remove a role from a managed user.")
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status409Conflict)
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
    }

    private static async Task<Results<NoContent, ProblemHttpResult>> Add(
        Guid userId,
        string roleName,
        UserPermissionVerifier userPermissionVerifier,
        IdentityService identityService,
        CancellationToken cancellationToken
    )
    {
        if (!await userPermissionVerifier.CanCurrentUserAccess(userId))
        {
            return Error
                .ForbiddenOperation("Nie można edytować tego użytkownika")
                .ToProblemHttpResult();
        }

        if (!await userPermissionVerifier.CanCurrentUserAssignRole(roleName))
        {
            return Error.ForbiddenOperation("Nie można nadać tej roli").ToProblemHttpResult();
        }

        var roles = await identityService.GetAllRoleNames(cancellationToken);
        if (!roles.Contains(roleName))
        {
            return Error.InvalidArgument("Rola nie istnieje").ToProblemHttpResult();
        }

        var result = await identityService.AddUserRole(userId, roleName, cancellationToken);
        return result.IsSuccess ? TypedResults.NoContent() : result.Error!.ToProblemHttpResult();
    }

    private static async Task<Results<NoContent, ProblemHttpResult>> Remove(
        Guid userId,
        string roleName,
        UserPermissionVerifier userPermissionVerifier,
        IdentityService identityService,
        CancellationToken cancellationToken
    )
    {
        if (!await userPermissionVerifier.CanCurrentUserAccess(userId))
        {
            return Error
                .ForbiddenOperation("Nie można edytować tego użytkownika")
                .ToProblemHttpResult();
        }

        if (!await userPermissionVerifier.CanCurrentUserAssignRole(roleName))
        {
            return Error.ForbiddenOperation("Nie można odebrać tej roli").ToProblemHttpResult();
        }

        var result = await identityService.RemoveUserRole(userId, roleName, cancellationToken);
        return result.IsSuccess ? TypedResults.NoContent() : result.Error!.ToProblemHttpResult();
    }
}
