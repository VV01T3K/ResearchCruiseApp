using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Domain.Common.Enums;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Domain.Logic;
using ResearchCruiseApp.Infrastructure.Persistence;

namespace ResearchCruiseApp.Application.Services.CruisesService;

internal class CruisesService(
    IYearBasedKeyGenerator yearBasedKeyGenerator,
    ApplicationDbContext dbContext
) : ICruisesService
{
    public async Task PersistCruiseWithNewNumber(Cruise cruise, CancellationToken cancellationToken)
    {
        cruise.Number = await yearBasedKeyGenerator.GenerateKey(
            dbContext.Cruises,
            cancellationToken
        );
        cruise.Status = CruiseStatus.New;

        await dbContext.Cruises.AddAsync(cruise, cancellationToken);
    }

    public async Task CheckEditedCruisesManagersTeams(
        List<Cruise> editedCruises,
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

            if (cruise.CruiseApplications.Any(app => app.FormA == null))
                continue;

            var managersAvailableIds = cruise
                .CruiseApplications.Select(app => app.FormA!.CruiseManagerId)
                .Union(cruise.CruiseApplications.Select(app => app.FormA!.DeputyManagerId))
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

    public async Task<List<Cruise>> GetBlockingCruisesForYear(
        int year,
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

    public async Task<bool> CheckForOverlappingCruises(
        DateTime start,
        DateTime end,
        int year,
        double cruiseDurationDays,
        CancellationToken cancellationToken
    )
    {
        var blockades = (await GetBlockingCruisesForYear(year, cancellationToken)).Select(
            blockade => (DateTime.Parse(blockade.StartDate), DateTime.Parse(blockade.EndDate))
        );

        return CruiseBlockadeRules.HasNoFreeWindow(start, end, cruiseDurationDays, blockades);
    }
}
