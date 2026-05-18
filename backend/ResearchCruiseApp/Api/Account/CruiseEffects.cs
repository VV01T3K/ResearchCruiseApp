using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Persistence;
using ResearchCruiseApp.Infrastructure.Identity.Permissions;

namespace ResearchCruiseApp.Api.Account;

public static class CruiseEffects
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

    private static async Task<Results<Ok<List<Response>>, NotFound>> Handle(
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

        return TypedResults.Ok(userEffects.Select(Response.From).ToList());
    }

    public sealed record Response(
        Guid Id,
        Guid UserId,
        EffectResponse Effect,
        string Points,
        string CruiseApplicationId
    )
    {
        public static Response From(UserEffect effect)
        {
            return new Response(
                effect.Id,
                effect.UserId,
                EffectResponse.From(effect.Effect),
                effect.Points.ToString(),
                effect.Effect.FormC.CruiseApplication.Id.ToString()
            );
        }
    }

    public sealed record EffectResponse(
        string Type,
        string? Title,
        string? Magazine,
        string? Author,
        string? Institution,
        string? Date,
        string? StartDate,
        string? EndDate,
        string? FinancingAmount,
        string? FinancingApproved,
        string? Description,
        string? SecuredAmount,
        string? MinisterialPoints,
        string Done,
        string? PublicationMinisterialPoints,
        string ManagerConditionMet,
        string DeputyConditionMet
    )
    {
        public static EffectResponse From(ResearchTaskEffect effect)
        {
            var task = effect.ResearchTask;

            return new EffectResponse(
                ((int)task.Type).ToString(),
                task.Title,
                task.Magazine,
                task.Author,
                task.Institution,
                task.Date,
                task.StartDate,
                task.EndDate,
                task.FinancingAmount,
                task.FinancingApproved,
                task.Description,
                task.SecuredAmount,
                task.MinisterialPoints,
                effect.Done,
                effect.PublicationMinisterialPoints,
                effect.ManagerConditionMet,
                effect.DeputyConditionMet
            );
        }
    }
}
