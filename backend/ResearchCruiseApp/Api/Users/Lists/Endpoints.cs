using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using ResearchCruiseApp.Infrastructure.Identity.Permissions;
using ResearchCruiseApp.Infrastructure.Persistence;

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
            .WithName("GetUsers")
            .WithSummary("Get manageable users.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
    }

    private static void MapGetAvailableCruiseManagers(RouteGroupBuilder group)
    {
        group
            .MapGet("/available-cruise-managers", GetAvailableCruiseManagers)
            .WithName("GetAvailableCruiseManagers")
            .WithSummary("Get users available as cruise managers.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
    }

    private static async Task<Ok<List<UserResponse>>> GetAll(
        UserPermissionVerifier userPermissionVerifier,
        ApplicationDbContext dbContext,
        CancellationToken cancellationToken
    )
    {
        var users = await dbContext.GetAllUsersDtos(cancellationToken);
        var permittedUsers = await userPermissionVerifier.FilterAccessibleUsers(users);
        return TypedResults.Ok(permittedUsers.Select(UserResponse.From).ToList());
    }

    private static async Task<Ok<List<CruiseManagerResponse>>> GetAvailableCruiseManagers(
        UserManager<User> userManager
    )
    {
        var users = new List<User>();

        foreach (var roleName in IdentityUserExtensions.CruiseManagerRoleNames)
        {
            var roleUsers = await userManager.GetUsersInRoleAsync(roleName);
            users.AddRange(roleUsers);
        }

        var distinctUsers = users.DistinctBy(u => u.Id).Where(u => u.Accepted).ToList();

        return TypedResults.Ok(
            distinctUsers
                .Select(UserMappings.ToCruiseManagerOptionDto)
                .Select(CruiseManagerResponse.From)
                .ToList()
        );
    }
}
