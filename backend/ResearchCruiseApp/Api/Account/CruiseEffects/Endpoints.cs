using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Infrastructure.Identity.Permissions;
using ResearchCruiseApp.Infrastructure.Persistence;

namespace ResearchCruiseApp.Api.Account;

public static class CruiseEffectsEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapGet("/cruise-effects", Handle)
            .WithName("GetCurrentUserCruiseEffectsV2")
            .WithSummary("Get cruise effects for the current user.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);
    }

    private static async Task<Results<Ok<List<CruiseEffectResponse>>, NotFound>> Handle(
        CurrentUserService currentUserService,
        ApplicationDbContext dbContext,
        CancellationToken cancellationToken
    )
    {
        var currentUserId = currentUserService.GetId();
        if (currentUserId is null)
        {
            return TypedResults.NotFound();
        }

        var userEffects = await dbContext
            .UserEffects.Include(userEffect => userEffect.Effect.FormC.CruiseApplication)
            .Include(userEffect => userEffect.Effect.ResearchTask)
            .Where(userEffect => userEffect.UserId == currentUserId.Value)
            .ToListAsync(cancellationToken);

        return TypedResults.Ok(userEffects.Select(CruiseEffectResponse.From).ToList());
    }
}
