using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Entities;
using ResearchCruiseApp_API.Infrastructure.Persistence;

namespace ResearchCruiseApp_API.Application.SharedServices.Cruises;


public class CruisesService(
    IYearBasedKeyGenerator yearBasedKeyGenerator,
    ICruisesRepository cruisesRepository,
    IUnitOfWork unitOfWork,
    ApplicationDbContext applicationDbContext)
    : ICruisesService
{
    public Task PersistCruiseWithNewNumber(Cruise cruise, CancellationToken cancellationToken)
    {
        return unitOfWork.ExecuteIsolated(async () =>
            {
                cruise.Number = await yearBasedKeyGenerator.GenerateKey(cruisesRepository, cancellationToken);

                await cruisesRepository.AddCruise(cruise, cancellationToken);
                await unitOfWork.Complete(cancellationToken);
            },
            System.Data.IsolationLevel.Serializable,
            cancellationToken
        );
    }
    
    public async Task CheckEditedCruisesManagersTeams(List<Cruise> editedCruises, CancellationToken cancellationToken)
    {
        foreach (var cruise in editedCruises)
        {
            foreach (var application in cruise.CruiseApplications)
            {
                await applicationDbContext.Entry(application)
                    .Reference(applicationEntry => applicationEntry.FormA)
                    .LoadAsync(cancellationToken);
            }

            if (cruise.CruiseApplications.Any(app => app.FormA == null))
                continue;

            var managersAvailable = cruise.CruiseApplications
                .Select(app => app.FormA!.CruiseManager)
                .Union(cruise.CruiseApplications
                    .Select(app => app.FormA!.DeputyManager))
                .ToList();

            if (cruise.MainCruiseManager is not null && !managersAvailable.Contains(cruise.MainCruiseManager))
                cruise.MainCruiseManager = null;
            if (cruise.MainDeputyManager is not null && !managersAvailable.Contains(cruise.MainDeputyManager))
                cruise.MainDeputyManager = null;
        }
    }
}