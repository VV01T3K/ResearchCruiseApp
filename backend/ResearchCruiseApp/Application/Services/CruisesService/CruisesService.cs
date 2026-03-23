using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.ExternalServices.Persistence;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Domain.Common.Enums;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.CruisesService;

internal class CruisesService(
    IYearBasedKeyGenerator yearBasedKeyGenerator,
    ICruisesRepository cruisesRepository,
    ICruiseApplicationsRepository cruiseApplicationsRepository,
    IUnitOfWork unitOfWork
) : ICruisesService
{
    public Task PersistCruiseWithNewNumber(Cruise cruise, CancellationToken cancellationToken)
    {
        return unitOfWork.ExecuteIsolated(
            async () =>
            {
                cruise.Number = await yearBasedKeyGenerator.GenerateKey(
                    cruisesRepository,
                    cancellationToken
                );
                cruise.Status = CruiseStatus.New;

                await cruisesRepository.Add(cruise, cancellationToken);
                await unitOfWork.Complete(cancellationToken);
            },
            cancellationToken
        );
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
                await cruiseApplicationsRepository.LoadFormA(cruiseApplication, cancellationToken);
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
        var cruises = await cruisesRepository.GetAll(cancellationToken);

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
        if ((end - start).TotalDays < cruiseDurationDays)
            return true;

        var overlappingBlockades = (await GetBlockingCruisesForYear(year, cancellationToken))
            .Select(b => new
            {
                Start = DateTime.Parse(b.StartDate),
                End = DateTime.Parse(b.EndDate),
            })
            .Where(b => b.End > start && b.Start < end)
            .Select(b => new
            {
                Start = b.Start < start ? start : b.Start,
                End = b.End > end ? end : b.End,
            })
            .OrderBy(b => b.Start)
            .ToList();

        if (overlappingBlockades.Count == 0)
            return false;

        var mergedBlockades = new List<(DateTime Start, DateTime End)>();
        foreach (var blockade in overlappingBlockades)
        {
            if (mergedBlockades.Count == 0)
            {
                mergedBlockades.Add((blockade.Start, blockade.End));
                continue;
            }

            var last = mergedBlockades[^1];
            if (blockade.Start <= last.End)
            {
                mergedBlockades[^1] = (
                    last.Start,
                    blockade.End > last.End ? blockade.End : last.End
                );
            }
            else
            {
                mergedBlockades.Add((blockade.Start, blockade.End));
            }
        }

        var freeSlotStart = start;

        foreach (var blockade in mergedBlockades)
        {
            if ((blockade.Start - freeSlotStart).TotalDays >= cruiseDurationDays)
                return false;

            if (blockade.End > freeSlotStart)
                freeSlotStart = blockade.End;
        }

        if ((end - freeSlotStart).TotalDays >= cruiseDurationDays)
            return false;

        // No free slot large enough, so selected period conflicts with blockades.
        return true;
    }
}
