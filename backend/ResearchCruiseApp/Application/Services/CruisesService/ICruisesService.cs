using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.CruisesService;


public interface ICruisesService
{
    Task PersistCruiseWithNewNumber(Cruise cruise, CancellationToken cancellationToken);
    
    /// <summary>
    /// Checks if the cruise managers teams assigned to the edited cruises are still available for these cruises
    /// </summary>
    Task CheckEditedCruisesManagersTeams(List<Cruise> editedCruises, CancellationToken cancellationToken);
}