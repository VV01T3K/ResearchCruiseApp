using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Infrastructure.Identity.Permissions;

namespace ResearchCruiseApp.Api.Account;

public static class MeEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapGet("/me", Handle)
            .WithName("GetCurrentUserV2")
            .WithSummary("Get the current account.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);
    }

    private static async Task<Results<Ok<CurrentUserResponse>, NotFound>> Handle(
        ICurrentUserService currentUserService,
        IIdentityService identityService
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
