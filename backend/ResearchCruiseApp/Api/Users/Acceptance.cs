using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Infrastructure.Identity.Permissions;
using ResearchCruiseApp.Results;

namespace ResearchCruiseApp.Api.Users;

public static class Acceptance
{
    public static void Map(RouteGroupBuilder group)
    {
        Accept.Map(group);
        Deactivate.Map(group);
    }

    public static class Accept
    {
        public static void Map(RouteGroupBuilder group)
        {
            group
                .MapPut("/{userId:guid}/acceptance", Handle)
                .WithName("AcceptUserV2")
                .WithSummary("Accept a managed user.")
                .ProducesProblem(StatusCodes.Status401Unauthorized)
                .ProducesProblem(StatusCodes.Status403Forbidden)
                .ProducesProblem(StatusCodes.Status404NotFound)
                .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
        }

        private static async Task<Results<NoContent, ProblemHttpResult>> Handle(
            Guid userId,
            IUserPermissionVerifier userPermissionVerifier,
            IIdentityService identityService
        )
        {
            if (!await userPermissionVerifier.CanCurrentUserAccess(userId))
            {
                return Error
                    .ForbiddenOperation("Nie można zaakceptować tego użytkownika")
                    .ToProblemHttpResult();
            }

            var result = await identityService.AcceptUser(userId);
            return result.IsSuccess
                ? TypedResults.NoContent()
                : result.Error!.ToProblemHttpResult();
        }
    }

    public static class Deactivate
    {
        public static void Map(RouteGroupBuilder group)
        {
            group
                .MapDelete("/{userId:guid}/acceptance", Handle)
                .WithName("DeactivateUserV2")
                .WithSummary("Deactivate a managed user.")
                .ProducesProblem(StatusCodes.Status401Unauthorized)
                .ProducesProblem(StatusCodes.Status403Forbidden)
                .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
        }

        private static async Task<Results<NoContent, ProblemHttpResult>> Handle(
            Guid userId,
            IUserPermissionVerifier userPermissionVerifier,
            IIdentityService identityService
        )
        {
            if (!await userPermissionVerifier.CanUserDeactivate(userId))
            {
                return Error.ForbiddenOperation().ToProblemHttpResult();
            }

            var result = await identityService.DeactivateUser(userId);
            return result.IsSuccess
                ? TypedResults.NoContent()
                : result.Error!.ToProblemHttpResult();
        }
    }
}
