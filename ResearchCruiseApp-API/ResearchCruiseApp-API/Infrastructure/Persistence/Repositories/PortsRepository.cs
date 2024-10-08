using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;


internal class PortsRepository : Repository<Port>, IPortsRepository
{
    public PortsRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }
}