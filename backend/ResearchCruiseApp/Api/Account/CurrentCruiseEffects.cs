using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications;
using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Infrastructure.Persistence;

namespace ResearchCruiseApp.Api.Account;

public static class CurrentCruiseEffects
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapGet("/me/cruise-effects", Get)
            .WithName("GetCurrentUserCruiseEffectsV2")
            .WithSummary("Get cruise effects for the current user.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);
    }

    private static async Task<Results<Ok<List<UserEffectDto>>, NotFound>> Get(
        ICurrentUserService currentUserService,
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

        return TypedResults.Ok(userEffects.Select(ApplicationMappings.ToUserEffectDto).ToList());
    }
}
