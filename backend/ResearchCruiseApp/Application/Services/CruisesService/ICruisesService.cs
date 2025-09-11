using ResearchCruiseApp.Application.Models.DTOs.Cruises;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.CruisesService;

public interface ICruisesService
{
    Task PersistCruiseWithNewNumber(Cruise cruise, CancellationToken cancellationToken);

    /// <summary>
    /// Checks if the cruise managers teams assigned to the edited cruises are still available for these cruises
    /// </summary>
    Task CheckEditedCruisesManagersTeams(
        List<Cruise> editedCruises,
        CancellationToken cancellationToken
    );

    Task<List<Cruise>> GetBlockingCruisesForYear(int year, CancellationToken cancellationToken);

    Task<bool> CheckForOverlappingCruises(
        DateTime start,
        DateTime end,
        int year,
        CancellationToken cancellationToken
    );
}
