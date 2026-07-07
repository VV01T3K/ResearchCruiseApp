using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Cruises.Shared;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Infrastructure.Persistence;
using ResearchCruiseApp.Results;

namespace ResearchCruiseApp.Api.Cruises;

public static class LifecycleEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        MapConfirm(group);
        MapRemoveConfirmation(group);
        MapComplete(group);
    }

    private static void MapConfirm(RouteGroupBuilder group)
    {
        group
            .MapPut("/{cruiseId:guid}/confirmation", Confirm)
            .WithName("ConfirmCruiseV2")
            .WithSummary("Confirm a cruise.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
    }

    private static void MapRemoveConfirmation(RouteGroupBuilder group)
    {
        group
            .MapDelete("/{cruiseId:guid}/confirmation", RemoveConfirmation)
            .WithName("RemoveCruiseConfirmationV2")
            .WithSummary("Revert the latest cruise lifecycle state.")
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
    }

    private static void MapComplete(RouteGroupBuilder group)
    {
        group
            .MapPut("/{cruiseId:guid}/completion", Complete)
            .WithName("CompleteCruiseV2")
            .WithSummary("Mark a cruise as completed.")
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
    }

    private static async Task<Results<NoContent, ProblemHttpResult>> Confirm(
        Guid cruiseId,
        ApplicationDbContext dbContext,
        EmailSender emailSender,
        IdentityService identityService,
        CancellationToken cancellationToken
    )
    {
        var cruise = await dbContext
            .Cruises.IncludeCruiseApplications()
                .ThenInclude(application => application.FormA)
            .IncludeCruiseApplications()
                .ThenInclude(application => application.FormB)
            .IncludeCruiseApplications()
                .ThenInclude(application => application.FormC)
            .SingleOrDefaultAsync(cruise => cruise.Id == cruiseId, cancellationToken);
        if (cruise is null)
        {
            return Error.ResourceNotFound().ToProblemHttpResult();
        }

        if (cruise.Status != CruiseStatus.New)
        {
            return Error.ForbiddenOperation("Rejs został już potwierdzony.").ToProblemHttpResult();
        }

        cruise.Status = CruiseStatus.Confirmed;
        foreach (var cruiseApplication in cruise.CruiseApplications)
        {
            if (cruiseApplication.FormA is null)
            {
                return Error
                    .ServerError($"Zgłoszenie {cruiseApplication.Id} nie zawiera Formularza A.")
                    .ToProblemHttpResult();
            }

            cruiseApplication.Status = CruiseApplicationStatus.FormBRequired;

            var deputyManager = await identityService.GetUserDtoById(
                cruiseApplication.FormA.DeputyManagerId
            );
            var cruiseManager = await identityService.GetUserDtoById(
                cruiseApplication.FormA.CruiseManagerId
            );

            if (deputyManager is not null)
            {
                await emailSender.SendCruiseConfirmMessage(
                    cruise,
                    deputyManager,
                    deputyManager.Email
                );
            }

            if (cruiseManager is not null)
            {
                await emailSender.SendCruiseConfirmMessage(
                    cruise,
                    cruiseManager,
                    cruiseManager.Email
                );
            }
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        return TypedResults.NoContent();
    }

    private static async Task<Results<NoContent, ProblemHttpResult>> RemoveConfirmation(
        Guid cruiseId,
        ApplicationDbContext dbContext,
        CancellationToken cancellationToken
    )
    {
        var cruise = await dbContext
            .Cruises.IncludeCruiseApplications()
            .SingleOrDefaultAsync(cruise => cruise.Id == cruiseId, cancellationToken);
        if (cruise is null)
        {
            return Error.ResourceNotFound().ToProblemHttpResult();
        }

        var result = CruiseLifecycleRules.Revert(cruise);
        if (result != CruiseLifecycleResult.Applied)
        {
            return Error.InvalidArgument("Rejs jest już w stanie 'Nowy'").ToProblemHttpResult();
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        return TypedResults.NoContent();
    }

    private static async Task<Results<NoContent, ProblemHttpResult>> Complete(
        Guid cruiseId,
        ApplicationDbContext dbContext,
        CancellationToken cancellationToken
    )
    {
        var cruise = await dbContext
            .Cruises.IncludeCruiseApplications()
            .SingleOrDefaultAsync(cruise => cruise.Id == cruiseId, cancellationToken);
        if (cruise is null)
        {
            return Error.ResourceNotFound().ToProblemHttpResult();
        }

        var result = CruiseLifecycleRules.Complete(cruise);
        if (result == CruiseLifecycleResult.NotConfirmed)
            return Error.InvalidArgument("Rejs nie został potwierdzony").ToProblemHttpResult();
        if (result == CruiseLifecycleResult.NotCompletable)
            return Error.InvalidArgument("Rejs nie został potwierdzoy").ToProblemHttpResult();

        await dbContext.SaveChangesAsync(cancellationToken);
        return TypedResults.NoContent();
    }
}
