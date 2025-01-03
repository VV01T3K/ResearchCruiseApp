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
}
