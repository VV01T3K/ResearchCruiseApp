using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Infrastructure.Identity.Contracts;

namespace ResearchCruiseApp.Api.Account;

public static class Me
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

    private static async Task<Results<Ok<Response>, NotFound>> Handle(
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
            : TypedResults.Ok(Response.From(currentUser));
    }

    public sealed record Response(
        Guid Id,
        string Email,
        string FirstName,
        string LastName,
        IList<string> Roles,
        bool EmailConfirmed,
        bool Accepted
    )
    {
        public static Response From(UserDto user)
        {
            return new Response(
                user.Id,
                user.Email,
                user.FirstName,
                user.LastName,
                user.Roles,
                user.EmailConfirmed,
                user.Accepted
            );
        }
    }
}
