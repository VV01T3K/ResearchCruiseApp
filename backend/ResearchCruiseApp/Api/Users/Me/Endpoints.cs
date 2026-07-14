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

    private static async Task<Results<Ok<CurrentUserResponse>, NotFound>> Handle(
        CurrentUserService currentUserService,
        IdentityService identityService
    )
    {
        var currentUserId = currentUserService.GetId();
        if (currentUserId is null)
        {
            return TypedResults.NotFound();
        }

        var currentUser = await identityService.GetUserDtoById(currentUserId.Value);
        return currentUser is null
            ? TypedResults.NotFound()
            : TypedResults.Ok(CurrentUserResponse.From(currentUser));
    }
}
