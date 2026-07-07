using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Api.Cruises.Shared;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Domain.Enums;
using ResearchCruiseApp.Infrastructure.Persistence;
using DomainCruise = ResearchCruiseApp.Domain.Entities.Cruise;

namespace ResearchCruiseApp.Api.Cruises;

public static class PlanningEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        MapAutoPlan(group);
        MapGetBlockades(group);
    }

    private static void MapAutoPlan(RouteGroupBuilder group)
    {
        group
            .MapPost("/auto-plan", AutoPlan)
            .WithName("AutoPlanCruisesV2")
            .WithSummary("Automatically plan eligible cruises.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
    }

    private static void MapGetBlockades(RouteGroupBuilder group)
    {
        group
            .MapGet("/blockades", GetBlockades)
            .WithName("GetCruiseBlockadesV2")
            .WithSummary("Get blockade periods for a year.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);
    }

    private static async Task<NoContent> AutoPlan(
        YearBasedKeyGenerator yearBasedKeyGenerator,
        ApplicationDbContext dbContext,
        GlobalizationService globalizationService,
        CancellationToken cancellationToken
    )
    {
        var applications = await dbContext
            .CruiseApplications.IncludeForms()
            .IncludeFormAContent()
            .ToListAsync(cancellationToken);
        var cruises = await dbContext
            .Cruises.IncludeCruiseApplications()
            .ToListAsync(cancellationToken);

        foreach (var application in applications)
        {
            if (
                application.Status != CruiseApplicationStatus.Accepted
                || cruises.Any(cruise => cruise.CruiseApplications.Contains(application))
            )
            {
                continue;
            }

            var cruise = CreateCruise(application, globalizationService);
            if (cruise is not null)
            {
                cruise.Number = await yearBasedKeyGenerator.GenerateKey(
                    dbContext.Cruises,
                    cancellationToken
                );
                cruise.Status = CruiseStatus.New;
                await dbContext.Cruises.AddAsync(cruise, cancellationToken);
            }
        }

        return TypedResults.NoContent();
    }

    private static async Task<Ok<List<BlockadeResponse>>> GetBlockades(
        int year,
        ApplicationDbContext dbContext,
        CancellationToken cancellationToken
    )
    {
        var blockingCruises = await GetBlockingCruisesForYear(year, dbContext, cancellationToken);
        return TypedResults.Ok(blockingCruises.Select(BlockadeResponse.From).ToList());
    }

    private static async Task<List<DomainCruise>> GetBlockingCruisesForYear(
        int year,
        ApplicationDbContext dbContext,
        CancellationToken cancellationToken
    )
    {
        var cruises = await dbContext.Cruises.ToListAsync(cancellationToken);

        return cruises
            .Where(cruise =>
                cruise.ShipUnavailable
                && (cruise.Status == CruiseStatus.New || cruise.Status == CruiseStatus.Confirmed)
            )
            .Where(cruise =>
                cruise.StartDate.StartsWith(year.ToString())
                || cruise.EndDate.StartsWith(year.ToString())
            )
            .ToList();
    }

    private static DomainCruise? CreateCruise(
        CruiseApplication application,
        GlobalizationService globalizationService
    )
    {
        if (application.FormA is null)
        {
            return null;
        }

        var (startDate, endDate) = GetAutoCalculatedDates(application.FormA, globalizationService);
        return new DomainCruise
        {
            MainCruiseManagerId = application.FormA.CruiseManagerId,
            MainDeputyManagerId = application.FormA.DeputyManagerId,
            StartDate = startDate,
            EndDate = endDate,
            CruiseApplications = [application],
        };
    }

    private static (string Start, string End) GetAutoCalculatedDates(
        FormA formA,
        GlobalizationService globalizationService
    )
    {
        if (formA is { PrecisePeriodStart: not null, PrecisePeriodEnd: not null })
        {
            return (
                globalizationService.GetIsoUtcString(
                    formA.PrecisePeriodStart.Value.Date.AddHours(8)
                ),
                globalizationService.GetIsoUtcString(formA.PrecisePeriodEnd.Value.Date.AddHours(8))
            );
        }

        var startDay = int.Parse(formA.OptimalPeriodBeg!) % 2 == 0 ? 1 : 15;
        var startMonth = int.Parse(formA.OptimalPeriodBeg!) / 2 + 1;
        var startDate = new DateTime(
            int.Parse(formA.Year),
            startMonth,
            startDay,
            8,
            0,
            0,
            DateTimeKind.Unspecified
        );
        var endDate = startDate.AddHours(int.Parse(formA.CruiseHours));

        return (
            globalizationService.GetIsoUtcString(startDate),
            globalizationService.GetIsoUtcString(endDate)
        );
    }
}
