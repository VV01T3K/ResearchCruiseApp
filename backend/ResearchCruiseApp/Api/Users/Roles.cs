using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Api.Common;
using ResearchCruiseApp.Api.Common.ServiceResult;

namespace ResearchCruiseApp.Api.Users;

public static class Roles
{
    public static void Map(RouteGroupBuilder group)
    {
        Add.Map(group);
        Remove.Map(group);
    }

    public static class Add
    {
        public static void Map(RouteGroupBuilder group)
        {
            group
                .MapPut("/{userId:guid}/roles/{roleName}", Handle)
                .WithName("AddUserRoleV2")
                .WithSummary("Add a role to a managed user.")
                .ProducesProblem(StatusCodes.Status400BadRequest)
                .ProducesProblem(StatusCodes.Status401Unauthorized)
                .ProducesProblem(StatusCodes.Status403Forbidden)
                .ProducesProblem(StatusCodes.Status404NotFound)
                .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
        }

        private static async Task<Results<NoContent, ProblemHttpResult>> Handle(
            Guid userId,
            string roleName,
            IUserPermissionVerifier userPermissionVerifier,
            IIdentityService identityService,
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
            return result.IsSuccess
                ? TypedResults.NoContent()
                : result.Error!.ToProblemHttpResult();
        }
    }

    public static class Remove
    {
        public static void Map(RouteGroupBuilder group)
        {
            group
                .MapDelete("/{userId:guid}/roles/{roleName}", Handle)
                .WithName("RemoveUserRoleV2")
                .WithSummary("Remove a role from a managed user.")
                .ProducesProblem(StatusCodes.Status400BadRequest)
                .ProducesProblem(StatusCodes.Status401Unauthorized)
                .ProducesProblem(StatusCodes.Status403Forbidden)
                .ProducesProblem(StatusCodes.Status404NotFound)
                .ProducesProblem(StatusCodes.Status409Conflict)
                .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
        }

        private static async Task<Results<NoContent, ProblemHttpResult>> Handle(
            Guid userId,
            string roleName,
            IUserPermissionVerifier userPermissionVerifier,
            IIdentityService identityService,
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
            return result.IsSuccess
                ? TypedResults.NoContent()
                : result.Error!.ToProblemHttpResult();
        }
    }
}
