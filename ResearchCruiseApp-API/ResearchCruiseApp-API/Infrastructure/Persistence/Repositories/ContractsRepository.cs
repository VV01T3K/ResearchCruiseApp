using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;


internal class ContractsRepository : Repository<Contract>, IContractsRepository
{
    public ContractsRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }
}