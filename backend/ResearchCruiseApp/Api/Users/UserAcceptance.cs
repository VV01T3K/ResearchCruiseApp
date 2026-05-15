using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Services.UserPermissionVerifier;

namespace ResearchCruiseApp.Api.Users;

public static class UserAcceptance
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapPut("/{userId:guid}/acceptance", Accept)
            .WithName("AcceptUserV2")
            .WithSummary("Accept a managed user.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);

        group
            .MapDelete("/{userId:guid}/acceptance", Deactivate)
            .WithName("DeactivateUserV2")
            .WithSummary("Deactivate a managed user.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
    }

    private static async Task<Results<NoContent, ProblemHttpResult>> Accept(
        Guid userId,
        IIdentityService identityService
    )
    {
        var result = await identityService.AcceptUser(userId);
        return result.IsSuccess ? TypedResults.NoContent() : result.Error!.ToProblemHttpResult();
    }

    private static async Task<Results<NoContent, ProblemHttpResult>> Deactivate(
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
        return result.IsSuccess ? TypedResults.NoContent() : result.Error!.ToProblemHttpResult();
    }
}
