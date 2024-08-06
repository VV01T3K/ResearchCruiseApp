using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;


public interface ICruisesRepository : IRepository<Cruise>
{
    Task<Cruise?> GetCruiseById(Guid id, CancellationToken cancellationToken);
    Task<List<Cruise>> GetAllCruises(CancellationToken cancellationToken);
    Task AddCruise(Cruise cruise, CancellationToken cancellationToken);
    Task<List<Cruise>> GetCruisesByCruiseApplicationsIds(List<Guid> ids, CancellationToken cancellationToken);
    void DeleteCruise(Cruise cruise);
}