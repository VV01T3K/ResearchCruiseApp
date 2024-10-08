using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;


public interface ICruiseApplicationsRepository : IRepository<CruiseApplication>
{
    Task<List<CruiseApplication>> GetAllWithFormsAndFormAContent(CancellationToken cancellationToken);
    
    Task<CruiseApplication?> GetByIdWithFormA(Guid id, CancellationToken cancellationToken);
    
    Task<CruiseApplication?> GetByIdWithFormsAndFormAContent(Guid id, CancellationToken cancellationToken);
    
    Task<CruiseApplication?> GetByIdWithFormAContent(Guid id, CancellationToken cancellationToken);
    
    Task<CruiseApplication?> GetByIdWithFormAAndFormBContent(Guid id, CancellationToken cancellationToken);
    
    Task<List<CruiseApplication>> GetAllByIds(List<Guid> ids, CancellationToken cancellationToken);
    
    Task<FormA?> GetFormAByCruiseApplicationId(Guid id, CancellationToken cancellationToken);
    
    Task<List<CruiseApplication>> GetAllByUserIdWithFormA(Guid userId, CancellationToken cancellationToken);
}