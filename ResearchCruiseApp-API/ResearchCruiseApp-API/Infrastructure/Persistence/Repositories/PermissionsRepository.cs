using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;


internal class PermissionsRepository : Repository<Permission>, IPermissionsRepository
{
    public PermissionsRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }
}