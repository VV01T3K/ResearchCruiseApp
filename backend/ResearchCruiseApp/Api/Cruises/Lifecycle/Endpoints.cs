using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Cruises.Shared;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Infrastructure.Persistence;

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
            .WithName("ConfirmCruise")
            .WithSummary("Confirm a cruise.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .WithSerializableTransaction()
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
    }

    private static void MapRemoveConfirmation(RouteGroupBuilder group)
    {
        group
            .MapDelete("/{cruiseId:guid}/confirmation", RemoveConfirmation)
            .WithName("RemoveCruiseConfirmation")
            .WithSummary("Revert the latest cruise lifecycle state.")
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .WithSerializableTransaction()
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
    }

    private static void MapComplete(RouteGroupBuilder group)
    {
        group
            .MapPut("/{cruiseId:guid}/completion", Complete)
            .WithName("CompleteCruise")
            .WithSummary("Mark a cruise as completed.")
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .WithSerializableTransaction()
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

        var missingFormA = cruise.CruiseApplications.FirstOrDefault(application =>
            application.FormA is null
        );
        if (missingFormA is not null)
        {
            return Error
                .ServerError($"Zgłoszenie {missingFormA.Id} nie zawiera Formularza A.")
                .ToProblemHttpResult();
        }

        cruise.Status = CruiseStatus.Confirmed;
        var formBRequested = CruiseLifecycleRules.RequestFormB(cruise.CruiseApplications);
        await CruiseConfirmationEmails.Send(cruise, formBRequested, emailSender, identityService);

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
        if (result == CruiseLifecycleResult.AlreadyNew)
        {
            return Error.InvalidArgument("Rejs jest już w stanie 'Nowy'").ToProblemHttpResult();
        }

        if (result == CruiseLifecycleResult.HasReportedApplications)
        {
            return Error
                .InvalidArgument(
                    "Nie można cofnąć statusu rejsu, ponieważ co najmniej jedno zgłoszenie ma już złożony Formularz C."
                )
                .ToProblemHttpResult();
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
