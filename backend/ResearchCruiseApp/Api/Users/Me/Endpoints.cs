using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Infrastructure.Identity.Permissions;

namespace ResearchCruiseApp.Api.Users;

public static class MeEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapGet("", Handle)
            .WithName("GetCurrentUser")
            .WithSummary("Get the current account.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);
    }

    private static async Task<Results<Ok<CurrentUserResponse>, UnauthorizedHttpResult>> Handle(
        CurrentUserService currentUserService,
        IdentityService identityService
    )
    {
        var currentUserId = currentUserService.GetId();
        if (currentUserId is null)
        {
            return TypedResults.Unauthorized();
        }

        var currentUser = await identityService.GetUserDtoById(currentUserId.Value);
        return currentUser is null
            ? TypedResults.Unauthorized()
            : TypedResults.Ok(CurrentUserResponse.From(currentUser));
    }
}
