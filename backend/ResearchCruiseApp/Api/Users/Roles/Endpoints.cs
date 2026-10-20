using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Infrastructure.Api;
using ResearchCruiseApp.Infrastructure.Identity.Permissions;

namespace ResearchCruiseApp.Api.Users;

public static class RolesEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        MapAdd(group);
        MapRemove(group);
        MapReplace(group);
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

    private static void MapReplace(RouteGroupBuilder group)
    {
        group
            .MapPut("/{userId:guid}/role", Replace)
            .WithName("ReplaceUserRole")
            .WithSummary("Replace all roles of a managed user with a single role.")
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .WithRequestValidation<ReplaceUserRoleRequest>()
            .WithSerializableTransaction()
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

    private static async Task<Results<NoContent, ProblemHttpResult>> Replace(
        Guid userId,
        ReplaceUserRoleRequest request,
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

        if (!await userPermissionVerifier.CanCurrentUserAssignRole(request.RoleName))
        {
            return Error.ForbiddenOperation("Nie można nadać tej roli").ToProblemHttpResult();
        }

        foreach (var currentRole in await identityService.GetUserRolesNames(userId))
        {
            if (!await userPermissionVerifier.CanCurrentUserAssignRole(currentRole))
            {
                return Error.ForbiddenOperation("Nie można odebrać tej roli").ToProblemHttpResult();
            }
        }

        var roles = await identityService.GetAllRoleNames(cancellationToken);
        if (!roles.Contains(request.RoleName))
        {
            return Error.InvalidArgument("Rola nie istnieje").ToProblemHttpResult();
        }

        var result = await identityService.ReplaceUserRoles(userId, request.RoleName);
        return result.IsSuccess ? TypedResults.NoContent() : result.Error!.ToProblemHttpResult();
    }
}
