using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications.Factories.CruiseDtos;
using ResearchCruiseApp.Api.Common;
using ResearchCruiseApp.Api.Common.ServiceResult;
using ResearchCruiseApp.Api.Cruises.Workflows;
using ResearchCruiseApp.Domain.Common.Enums;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Persistence;
using ResearchCruiseApp.Infrastructure.Persistence.Repositories.Extensions;

namespace ResearchCruiseApp.Api.Cruises;

public static class CruiseCatalog
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapGet("", GetAll)
            .WithName("GetCruisesV2")
            .WithSummary("Get visible cruises.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);

        group
            .MapPost("", Create)
            .WithName("CreateCruiseV2")
            .WithSummary("Create a cruise.")
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .WithRequestValidation<CruiseWriteRequest>()
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
    }

    private static async Task<Ok<List<CruiseResponse>>> GetAll(
        ICruiseDtosFactory cruiseDtosFactory,
        ApplicationDbContext dbContext,
        IUserPermissionVerifier userPermissionVerifier,
        CancellationToken cancellationToken
    )
    {
        var cruises = await dbContext
            .Cruises.IncludeCruiseApplications()
                .ThenInclude(application => application.FormA!.Permissions)
            .IncludeCruiseApplications()
                .ThenInclude(application => application.FormA!.FormAResearchTasks)
            .IncludeCruiseApplications()
                .ThenInclude(application => application.FormA!.FormAContracts)
            .IncludeCruiseApplications()
                .ThenInclude(application => application.FormA!.FormAUgUnits)
            .IncludeCruiseApplications()
                .ThenInclude(application => application.FormA!.FormAGuestUnits)
            .IncludeCruiseApplications()
                .ThenInclude(application => application.FormA!.FormAPublications)
            .IncludeCruiseApplications()
                .ThenInclude(application => application.FormA!.FormASpubTasks)
            .ToListAsync(cancellationToken);

        var visibleCruises = new List<CruiseResponse>();
        foreach (var cruise in cruises)
        {
            if (await userPermissionVerifier.CanCurrentUserViewCruise(cruise))
            {
                visibleCruises.Add(CruiseResponse.From(await cruiseDtosFactory.Create(cruise)));
            }
        }

        return TypedResults.Ok(visibleCruises);
    }

    private static async Task<Results<Created, ProblemHttpResult>> Create(
        CruiseWriteRequest request,
        ICruisesService cruisesService,
        ApplicationDbContext dbContext,
        CancellationToken cancellationToken
    )
    {
        var cruiseApplications = await dbContext
            .CruiseApplications.Where(application =>
                request.CruiseApplicationIds.Contains(application.Id)
            )
            .ToListAsync(cancellationToken);
        var newCruise = new Cruise
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

        await cruisesService.PersistCruiseWithNewNumber(newCruise, cancellationToken);
        await cruisesService.CheckEditedCruisesManagersTeams(affectedCruises, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);

        return TypedResults.Created();
    }
}
