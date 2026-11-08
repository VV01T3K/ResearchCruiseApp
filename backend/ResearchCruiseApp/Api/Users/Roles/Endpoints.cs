using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
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
            .WithSerializableTransaction()
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
            .WithSerializableTransaction()
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
        UserManager<User> userManager,
        RoleManager<IdentityRole> roleManager,
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

        var roles = await roleManager
            .Roles.Select(role => role.Name)
            .ToListAsync(cancellationToken);
        if (!roles.Contains(roleName))
        {
            return Error.InvalidArgument("Rola nie istnieje").ToProblemHttpResult();
        }

        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null)
            return Error.ResourceNotFound().ToProblemHttpResult();

        var identityResult = await userManager.AddToRoleAsync(user, roleName);
        return identityResult.Succeeded
            ? TypedResults.NoContent()
            : identityResult.ToApplicationResult().Error!.ToProblemHttpResult();
    }

    private static async Task<Results<NoContent, ProblemHttpResult>> Remove(
        Guid userId,
        string roleName,
        UserPermissionVerifier userPermissionVerifier,
        CurrentUserService currentUserService,
        UserAdministrationService userAdministrationService,
        CancellationToken cancellationToken
    )
    {
        if (currentUserService.GetId() == userId)
        {
            return Error.ForbiddenOperation("Nie można zmienić własnej roli").ToProblemHttpResult();
        }

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

        var result = await userAdministrationService.RemoveUserRole(
            userId,
            roleName,
            cancellationToken
        );
        return result.IsSuccess ? TypedResults.NoContent() : result.Error!.ToProblemHttpResult();
    }

    private static async Task<Results<NoContent, ProblemHttpResult>> Replace(
        Guid userId,
        ReplaceUserRoleRequest request,
        UserPermissionVerifier userPermissionVerifier,
        CurrentUserService currentUserService,
        UserManager<User> userManager,
        RoleManager<IdentityRole> roleManager,
        UserAdministrationService userAdministrationService,
        CancellationToken cancellationToken
    )
    {
        if (currentUserService.GetId() == userId)
        {
            return Error.ForbiddenOperation("Nie można zmienić własnej roli").ToProblemHttpResult();
        }

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

        foreach (var currentRole in await userManager.GetUserRolesNames(userId))
        {
            if (!await userPermissionVerifier.CanCurrentUserAssignRole(currentRole))
            {
                return Error.ForbiddenOperation("Nie można odebrać tej roli").ToProblemHttpResult();
            }
        }

        var roles = await roleManager
            .Roles.Select(role => role.Name)
            .ToListAsync(cancellationToken);
        if (!roles.Contains(request.RoleName))
        {
            return Error.InvalidArgument("Rola nie istnieje").ToProblemHttpResult();
        }

        var result = await userAdministrationService.ReplaceUserRoles(userId, request.RoleName);
        return result.IsSuccess ? TypedResults.NoContent() : result.Error!.ToProblemHttpResult();
    }
}
