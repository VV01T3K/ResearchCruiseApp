using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;


public interface ICruisesRepository : IRepository<Cruise>
{
    Task<Cruise?> GetByIdWithCruiseApplications(Guid id, CancellationToken cancellationToken);
    
    Task<List<Cruise>> GetAllWithCruiseApplications(CancellationToken cancellationToken);
    
    Task<List<Cruise>> GetAllWithCruiseApplicationsWithFormAContent(CancellationToken cancellationToken);
    
    Task<List<Cruise>> GetByCruiseApplicationsIds(List<Guid> ids, CancellationToken cancellationToken);
    
    void Delete(Cruise cruise);
}