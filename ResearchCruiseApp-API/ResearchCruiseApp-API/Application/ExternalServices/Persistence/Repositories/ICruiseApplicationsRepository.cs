using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;


public interface ICruiseApplicationsRepository : IRepository<CruiseApplication>
{
    Task<List<CruiseApplication>> GetAllCruiseApplications(CancellationToken cancellationToken);
    Task<CruiseApplication?> GetCruiseApplicationById(Guid id, CancellationToken cancellationToken);
    Task AddCruiseApplication(CruiseApplication cruiseApplication, CancellationToken cancellationToken);
    Task<List<CruiseApplication>> GetCruiseApplicationsByIds(List<Guid> ids, CancellationToken cancellationToken);
    Task<FormA?> GetFormAByCruiseApplicationId(Guid id, CancellationToken cancellationToken);
}