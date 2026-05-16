using Microsoft.AspNetCore.Http.HttpResults;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.DTOs.Cruises;
using ResearchCruiseApp.Application.Services.CruisesService;
using ResearchCruiseApp.Application.Services.Factories.CruiseBlockadePeriodDtos;
using ResearchCruiseApp.Domain.Common.Enums;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Cruises;

public static class CruisePlanning
{
    public static void Map(RouteGroupBuilder group)
    {
        group
            .MapPost("/auto-plan", AutoPlan)
            .WithName("AutoPlanCruisesV2")
            .WithSummary("Automatically plan eligible cruises.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);

        group
            .MapGet("/blockades", GetBlockades)
            .WithName("GetCruiseBlockadesV2")
            .WithSummary("Get blockade periods for a year.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);
    }

    private static async Task<NoContent> AutoPlan(
        ICruisesService cruisesService,
        ICruiseApplicationsRepository cruiseApplicationsRepository,
        ICruisesRepository cruisesRepository,
        IGlobalizationService globalizationService,
        CancellationToken cancellationToken
    )
    {
        var applications = await cruiseApplicationsRepository.GetAllWithFormsAndFormAContent(
            cancellationToken
        );
        var cruises = await cruisesRepository.GetAllWithCruiseApplications(cancellationToken);

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
                await cruisesService.PersistCruiseWithNewNumber(cruise, cancellationToken);
            }
        }

        return TypedResults.NoContent();
    }

    private static async Task<Ok<List<CruiseBlockadePeriodDto>>> GetBlockades(
        int year,
        ICruisesService cruisesService,
        ICruiseBlockadePeriodDtosFactory dtoFactory,
        CancellationToken cancellationToken
    )
    {
        var blockingCruises = await cruisesService.GetBlockingCruisesForYear(
            year,
            cancellationToken
        );
        var periods = new List<CruiseBlockadePeriodDto>();

        foreach (var cruise in blockingCruises)
        {
            periods.Add(await dtoFactory.Create(cruise));
        }

        return TypedResults.Ok(periods);
    }

    private static Cruise? CreateCruise(
        CruiseApplication application,
        IGlobalizationService globalizationService
    )
    {
        if (application.FormA is null)
        {
            return null;
        }

        var (startDate, endDate) = GetAutoCalculatedDates(application.FormA, globalizationService);
        return new Cruise
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
        IGlobalizationService globalizationService
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
