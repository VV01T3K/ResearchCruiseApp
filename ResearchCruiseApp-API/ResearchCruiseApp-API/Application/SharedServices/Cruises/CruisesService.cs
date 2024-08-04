using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Domain.Entities;
using ResearchCruiseApp_API.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ResearchCruiseApp_API.Application.SharedServices.Cruises;


public class CruisesService(
    IYearBasedKeyGenerator yearBasedKeyGenerator,
    ApplicationDbContext applicationDbContext)
    : ICruisesService
{
    public async Task PersistCruiseWithNewNumber(Cruise cruise, CancellationToken cancellationToken)
    {
        // Using transaction to prevent multiple users from generating a cruise with the same number
        await using var transaction =
            await applicationDbContext.Database.BeginTransactionAsync(
                System.Data.IsolationLevel.Serializable,
                cancellationToken);
        try
        {
            cruise.Number = yearBasedKeyGenerator.GenerateKey(applicationDbContext.Cruises);

            await applicationDbContext.Cruises.AddAsync(cruise, cancellationToken);
            await applicationDbContext.SaveChangesAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);
        }
        catch (Exception)
        {
            await transaction.RollbackAsync(cancellationToken);
            throw;
        }
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