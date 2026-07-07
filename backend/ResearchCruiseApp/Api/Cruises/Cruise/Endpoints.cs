using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Cruises.Shared;
using ResearchCruiseApp.Domain.Enums;
using ResearchCruiseApp.Infrastructure.Persistence;
using ResearchCruiseApp.Results;
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
            .WithName("CreateCruiseV2")
            .WithSummary("Create a cruise.")
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .WithRequestValidation<CreateRequest>()
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
    }

    private static void MapUpdate(RouteGroupBuilder group)
    {
        group
            .MapPatch("/{cruiseId:guid}", Update)
            .WithName("UpdateCruiseV2")
            .WithSummary("Update a cruise.")
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .WithRequestValidation<UpdateRequest>()
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
    }

    private static void MapDelete(RouteGroupBuilder group)
    {
        group
            .MapDelete("/{cruiseId:guid}", Delete)
            .WithName("DeleteCruiseV2")
            .WithSummary("Delete a cruise.")
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
    }

    private static async Task<Results<Created, ProblemHttpResult>> Create(
        CreateRequest request,
        IYearBasedKeyGenerator yearBasedKeyGenerator,
        ApplicationDbContext dbContext,
        CancellationToken cancellationToken
    )
    {
        var cruiseApplications = await dbContext
            .CruiseApplications.Where(application =>
                request.CruiseApplicationIds.Contains(application.Id)
            )
            .ToListAsync(cancellationToken);
        var newCruise = new DomainCruise
        {
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            MainCruiseManagerId = request.MainManagerId,
            MainDeputyManagerId = request.DeputyManagerId,
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
        await dbContext.SaveChangesAsync(cancellationToken);

        return TypedResults.Created();
    }

    private static async Task<Results<NoContent, ProblemHttpResult>> Update(
        Guid cruiseId,
        UpdateRequest request,
        IIdentityService identityService,
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

        var managerResult = await UpdateManagers(cruise, request, identityService);
        if (!managerResult.IsSuccess)
        {
            return managerResult.Error!.ToProblemHttpResult();
        }

        var newCruiseApplications = await dbContext
            .CruiseApplications.Where(application =>
                request.CruiseApplicationIds.Contains(application.Id)
            )
            .ToListAsync(cancellationToken);
        foreach (var application in newCruiseApplications)
        {
            if (
                cruise.Status == CruiseStatus.Confirmed
                && application.Status == CruiseApplicationStatus.Accepted
            )
            {
                application.Status = CruiseApplicationStatus.FormBRequired;
            }

            if (
                cruise.Status == CruiseStatus.Ended
                && application.Status == CruiseApplicationStatus.FormBFilled
            )
            {
                application.Status = CruiseApplicationStatus.Undertaken;
            }
        }

        cruise.CruiseApplications = newCruiseApplications;
        await dbContext.SaveChangesAsync(cancellationToken);
        return TypedResults.NoContent();
    }

    private static async Task<Results<NoContent, ProblemHttpResult>> Delete(
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

        if (cruise.Status != CruiseStatus.New && cruise.Status != CruiseStatus.Confirmed)
        {
            return Error.InvalidArgument("Nie można już usunąć rejsu").ToProblemHttpResult();
        }

        if (cruise.Status == CruiseStatus.Confirmed)
        {
            foreach (var application in cruise.CruiseApplications)
            {
                application.Status = CruiseApplicationStatus.Accepted;
            }
        }

        dbContext.Cruises.Remove(cruise);
        await dbContext.SaveChangesAsync(cancellationToken);
        return TypedResults.NoContent();
    }

    private static async Task<Result> UpdateManagers(
        DomainCruise cruise,
        UpdateRequest request,
        IIdentityService identityService
    )
    {
        if (
            request.MainManagerId != Guid.Empty
            && await identityService.GetUserDtoById(request.MainManagerId) is null
        )
        {
            return Error.ResourceNotFound("Podany kierownik nie istnieje");
        }

        if (
            request.DeputyManagerId != Guid.Empty
            && await identityService.GetUserDtoById(request.DeputyManagerId) is null
        )
        {
            return Error.ResourceNotFound("Podany zastępca nie istnieje");
        }

        cruise.MainCruiseManagerId = request.MainManagerId;
        cruise.MainDeputyManagerId = request.DeputyManagerId;
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
