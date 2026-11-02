using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Infrastructure.Identity.Permissions;
using ResearchCruiseApp.Infrastructure.Persistence;

namespace ResearchCruiseApp.Api.Users;

public static class CruiseEffectsEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapGet("/cruise-effects", Handle)
            .WithName("GetCurrentUserCruiseEffects")
            .WithSummary("Get cruise effects for the current user.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .RequireAuthorization(AuthorizationPolicies.ApplicationReaders);
    }

    private static async Task<Results<Ok<CruiseEffectsResponse>, NotFound>> Handle(
        CurrentUserService currentUserService,
        ApplicationDbContext dbContext,
        ILogger<CruiseEffectResponse> logger,
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

        var orphanedIds = userEffects
            .Where(userEffect => userEffect.Effect.FormC.CruiseApplication is null)
            .Select(userEffect => userEffect.Id)
            .ToList();
        if (orphanedIds.Count > 0)
            logger.LogError(
                "Skipped user effects whose Form C has no application: {UserEffectIds}",
                orphanedIds
            );

        return TypedResults.Ok(
            new CruiseEffectsResponse(
                userEffects
                    .Where(userEffect => userEffect.Effect.FormC.CruiseApplication is not null)
                    .Select(CruiseEffectResponse.From)
                    .ToList(),
                orphanedIds.Count
            )
        );
    }
}
