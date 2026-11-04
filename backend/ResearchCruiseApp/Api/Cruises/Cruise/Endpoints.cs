using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Cruises.Shared;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Persistence;
using DomainCruise = ResearchCruiseApp.Domain.Entities.Cruise;

namespace ResearchCruiseApp.Api.Cruises;

public static class CruiseEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        MapCreate(group);
        MapUpdate(group);
        MapDelete(group);
    }

    private static void MapCreate(RouteGroupBuilder group)
    {
        group
            .MapPost("", Create)
            .WithName("CreateCruise")
            .WithSummary("Create a cruise.")
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .WithSerializableTransaction()
            .WithRequestValidation<CreateRequest>()
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
    }

    private static void MapUpdate(RouteGroupBuilder group)
    {
        group
            .MapPatch("/{cruiseId:guid}", Update)
            .WithName("UpdateCruise")
            .WithSummary("Update a cruise.")
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .WithSerializableTransaction()
            .WithRequestValidation<UpdateRequest>()
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
    }

    private static void MapDelete(RouteGroupBuilder group)
    {
        group
            .MapDelete("/{cruiseId:guid}", Delete)
            .WithName("DeleteCruise")
            .WithSummary("Delete a cruise.")
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .WithSerializableTransaction()
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
    }

    private static async Task<Results<Created, ProblemHttpResult>> Create(
        CreateRequest request,
        YearBasedKeyGenerator yearBasedKeyGenerator,
        IdentityService identityService,
        ApplicationDbContext dbContext,
        CancellationToken cancellationToken
    )
    {
        await yearBasedKeyGenerator.Lock<DomainCruise>(cancellationToken);
        var cruiseApplications = await dbContext
            .CruiseApplications.Where(application =>
                request.CruiseApplicationIds.Contains(application.Id)
            )
            .ToListAsync(cancellationToken);
        var newCruise = new DomainCruise
        {
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            CruiseApplications = cruiseApplications,
            Title = request.Title,
            ShipUnavailable = request.ShipUnavailable,
        };

        if (
            newCruise.CruiseApplications.Any(application =>
                application.Status != CruiseApplicationStatus.Accepted
            )
        )
        {
            return Error
                .InvalidArgument(
                    "Można dodać do rejsu jedynie zgłoszenia w stanie \"Zaakceptowane\""
                )
                .ToProblemHttpResult();
        }

        var managerResult = await UpdateManagers(
            newCruise,
            request.MainManagerId,
            request.DeputyManagerId,
            identityService
        );
        if (!managerResult.IsSuccess)
            return managerResult.Error!.ToProblemHttpResult();

        var affectedCruises = await dbContext
            .Cruises.IncludeCruiseApplications()
            .Where(cruise =>
                request.CruiseApplicationIds.Any(id =>
                    cruise.CruiseApplications.Select(application => application.Id).Contains(id)
                )
            )
            .ToListAsync(cancellationToken);

        newCruise.Number = await yearBasedKeyGenerator.GenerateKey(
            dbContext.Cruises,
            cancellationToken
        );
        newCruise.Status = CruiseStatus.New;
        await dbContext.Cruises.AddAsync(newCruise, cancellationToken);
        await ClearUnavailableManagers(affectedCruises, dbContext, cancellationToken);
        affectedCruises.ForEach(cruise => dbContext.Entry(cruise).State = EntityState.Modified);

        return TypedResults.Created();
    }

    private static async Task<Results<Ok<RevisionResponse>, ProblemHttpResult>> Update(
        Guid cruiseId,
        UpdateRequest request,
        IdentityService identityService,
        EmailSender emailSender,
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

        if (!cruise.RowVersion.Matches(request.Revision))
        {
            return Revisions.StaleRevision();
        }

        // Form C stays editable after the cruise ends; the cruise itself does not.
        if (cruise.Status == CruiseStatus.Ended)
        {
            return Error
                .InvalidArgument(
                    "Nie można edytować zakończonego rejsu. Aby wprowadzić zmiany, najpierw cofnij status rejsu."
                )
                .ToProblemHttpResult();
        }

        var newApplicationIds = request
            .CruiseApplicationIds.Where(id =>
                !cruise.CruiseApplications.Any(application => application.Id == id)
            )
            .ToList();
        if (newApplicationIds.Count != 0)
        {
            var newApplications = await dbContext
                .CruiseApplications.Where(application => newApplicationIds.Contains(application.Id))
                .ToListAsync(cancellationToken);
            if (
                newApplications.Any(application =>
                    application.Status != CruiseApplicationStatus.Accepted
                )
            )
            {
                return Error
                    .InvalidArgument(
                        "Można dodać do rejsu jedynie zgłoszenia w stanie: zaakceptowane"
                    )
                    .ToProblemHttpResult();
            }
        }

        cruise.StartDate = request.StartDate;
        cruise.EndDate = request.EndDate;
        cruise.Title = request.Title;
        cruise.ShipUnavailable = request.ShipUnavailable;

        var managerResult = await UpdateManagers(
            cruise,
            request.MainManagerId,
            request.DeputyManagerId,
            identityService
        );
        if (!managerResult.IsSuccess)
        {
            return managerResult.Error!.ToProblemHttpResult();
        }

        var newCruiseApplications = await dbContext
            .CruiseApplications.Include(application => application.FormA)
            .Include(application => application.Cruise)
            .Where(application => request.CruiseApplicationIds.Contains(application.Id))
            .ToListAsync(cancellationToken);
        // Membership lives on application rows, so bump every cruise whose list changes.
        var changedCruises = newCruiseApplications
            .Select(application => application.Cruise)
            .Append(cruise)
            .OfType<DomainCruise>();
        foreach (var changedCruise in changedCruises)
            dbContext.Entry(changedCruise).State = EntityState.Modified;
        var formBRequested = new List<CruiseApplication>();
        // Removed applications can be planned again; Form B is kept.
        foreach (
            var application in cruise.CruiseApplications.Where(application =>
                !request.CruiseApplicationIds.Contains(application.Id)
            )
        )
        {
            application.Status = CruiseApplicationStatus.Accepted;
        }

        if (cruise.Status == CruiseStatus.Confirmed)
            formBRequested = CruiseLifecycleService.RequestFormB(newCruiseApplications);

        cruise.CruiseApplications = newCruiseApplications;
        // Managers of applications already on the cruise were told when it was confirmed.
        await CruiseConfirmationEmails.Send(
            cruise,
            formBRequested.Where(application => newApplicationIds.Contains(application.Id)),
            emailSender,
            identityService
        );
        await dbContext.SaveChangesAsync(cancellationToken);
        return TypedResults.Ok(new RevisionResponse(cruise.RowVersion.ToRevision()));
    }

    private static async Task<Results<NoContent, ProblemHttpResult>> Delete(
        Guid cruiseId,
        string? revision,
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

        if (!cruise.RowVersion.Matches(revision))
        {
            return Revisions.StaleRevision();
        }

        if (cruise.Status != CruiseStatus.New && cruise.Status != CruiseStatus.Confirmed)
        {
            return Error.InvalidArgument("Nie można już usunąć rejsu").ToProblemHttpResult();
        }

        foreach (var application in cruise.CruiseApplications)
        {
            application.Status = CruiseApplicationStatus.Accepted;
        }

        dbContext.Cruises.Remove(cruise);
        await dbContext.SaveChangesAsync(cancellationToken);
        return TypedResults.NoContent();
    }

    private static async Task<Result> UpdateManagers(
        DomainCruise cruise,
        Guid mainManagerId,
        Guid deputyManagerId,
        IdentityService identityService
    )
    {
        if (
            mainManagerId != Guid.Empty
            && mainManagerId != cruise.MainCruiseManagerId
            && !await identityService.IsActiveWithAnyRole(
                mainManagerId,
                IdentityService.CruiseManagerRoleNames
            )
        )
        {
            return Error.InvalidArgument(
                "Podany kierownik nie istnieje lub nie ma aktywnego konta z uprawnieniami kierownika."
            );
        }

        if (
            deputyManagerId != Guid.Empty
            && deputyManagerId != cruise.MainDeputyManagerId
            && !await identityService.IsActiveWithAnyRole(
                deputyManagerId,
                IdentityService.CruiseManagerRoleNames
            )
        )
        {
            return Error.InvalidArgument(
                "Podany zastępca kierownika nie istnieje lub nie ma aktywnego konta z uprawnieniami kierownika."
            );
        }

        cruise.MainCruiseManagerId = mainManagerId;
        cruise.MainDeputyManagerId = deputyManagerId;
        return Result.Empty;
    }

    private static async Task ClearUnavailableManagers(
        List<DomainCruise> editedCruises,
        ApplicationDbContext dbContext,
        CancellationToken cancellationToken
    )
    {
        foreach (var cruise in editedCruises)
        {
            foreach (var cruiseApplication in cruise.CruiseApplications)
            {
                await dbContext
                    .Entry(cruiseApplication)
                    .Reference(applicationEntry => applicationEntry.FormA)
                    .LoadAsync(cancellationToken);
            }

            if (cruise.CruiseApplications.Any(application => application.FormA is null))
                continue;

            var managersAvailableIds = cruise
                .CruiseApplications.Select(application => application.FormA!.CruiseManagerId)
                .Union(
                    cruise.CruiseApplications.Select(application =>
                        application.FormA!.DeputyManagerId
                    )
                )
                .ToList();

            if (
                cruise.MainCruiseManagerId != Guid.Empty
                && !managersAvailableIds.Contains(cruise.MainCruiseManagerId)
            )
                cruise.MainCruiseManagerId = Guid.Empty;

            if (
                cruise.MainDeputyManagerId != Guid.Empty
                && !managersAvailableIds.Contains(cruise.MainDeputyManagerId)
            )
                cruise.MainDeputyManagerId = Guid.Empty;
        }
    }
}
