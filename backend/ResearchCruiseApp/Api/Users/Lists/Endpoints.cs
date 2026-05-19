using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Infrastructure.Identity.Permissions;

namespace ResearchCruiseApp.Api.Users;

public static class ListsEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        MapGetAll(group);
        MapGetAvailableCruiseManagers(group);
    }

    private static void MapGetAll(RouteGroupBuilder group)
    {
        group
            .MapGet("", GetAll)
            .WithName("GetUsersV2")
            .WithSummary("Get manageable users.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
    }

    private static void MapGetAvailableCruiseManagers(RouteGroupBuilder group)
    {
        group
            .MapGet("/available-cruise-managers", GetAvailableCruiseManagers)
            .WithName("GetAvailableCruiseManagersV2")
            .WithSummary("Get users available as cruise managers.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
    }

    private static async Task<Ok<List<UserResponse>>> GetAll(
        IUserPermissionVerifier userPermissionVerifier,
        IIdentityService identityService,
        CancellationToken cancellationToken
    )
    {
        var users = await identityService.GetAllUsersDtos(cancellationToken);
        var permittedUsers = new List<UserResponse>();

        foreach (var user in users)
        {
            if (await userPermissionVerifier.CanCurrentUserAccess(user.Id))
            {
                permittedUsers.Add(UserResponse.From(user));
            }
        }

        return TypedResults.Ok(permittedUsers);
    }

    private static async Task<Ok<List<CruiseManagerResponse>>> GetAvailableCruiseManagers(
        IIdentityService identityService,
        CancellationToken cancellationToken
    )
    {
        var users = await identityService.GetAllCruiseManagersDtos(cancellationToken);
        return TypedResults.Ok(users.Select(CruiseManagerResponse.From).ToList());
    }
}
