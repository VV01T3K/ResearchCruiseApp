using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Persistence.Repositories;


internal class PermissionsRepository : Repository<Permission>, IPermissionsRepository
{
    public PermissionsRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }


    public Task<int> CountFormsA(Permission permission, CancellationToken cancellationToken)
    {
        return DbContext.Permissions
            .Where(p => p.Id == permission.Id)
            .SelectMany(p => p.FormsA)
            .CountAsync(cancellationToken);
    }
    
    public Task<int> CountFormsB(Permission permission, CancellationToken cancellationToken)
    {
        return DbContext.Permissions
            .Where(p => p.Id == permission.Id)
            .SelectMany(p => p.FormsB)
            .CountAsync(cancellationToken);
    }
    
    public Task<int> CountFormsC(Permission permission, CancellationToken cancellationToken)
    {
        return DbContext.Permissions
            .Where(p => p.Id == permission.Id)
            .SelectMany(p => p.FormsC)
            .CountAsync(cancellationToken);
    }
}