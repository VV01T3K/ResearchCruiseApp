using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;

public interface IPermissionsRepository : IRepository<Permission>
{
    Task<int> CountFormsA(Permission permission, CancellationToken cancellationToken);

    Task<int> CountFormsB(Permission permission, CancellationToken cancellationToken);

    Task<int> CountFormsC(Permission permission, CancellationToken cancellationToken);
}
