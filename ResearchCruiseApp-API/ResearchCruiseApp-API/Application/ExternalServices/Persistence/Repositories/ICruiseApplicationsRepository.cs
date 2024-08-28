using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;


public interface ICruiseApplicationsRepository : IRepository<CruiseApplication>
{
    Task<List<CruiseApplication>> GetAll(CancellationToken cancellationToken);
    Task<CruiseApplication?> GetById(Guid id, CancellationToken cancellationToken);
    Task<CruiseApplication?> GetByIdWithFormAContent(Guid id, CancellationToken cancellationToken);
    Task Add(CruiseApplication cruiseApplication, CancellationToken cancellationToken);
    Task<List<CruiseApplication>> GetManyByIds(List<Guid> ids, CancellationToken cancellationToken);
    Task<FormA?> GetFormAByCruiseApplicationId(Guid id, CancellationToken cancellationToken);
}