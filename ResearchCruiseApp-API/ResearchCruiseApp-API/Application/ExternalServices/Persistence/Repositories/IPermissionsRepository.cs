using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;


public interface IPermissionsRepository : IRepository<Permission>
{
    Task<int> CountFormsA(Permission permission, CancellationToken cancellationToken);
    
    Task<int> CountFormsB(Permission permission, CancellationToken cancellationToken);
    
    Task<int> CountFormsC(Permission permission, CancellationToken cancellationToken);
}