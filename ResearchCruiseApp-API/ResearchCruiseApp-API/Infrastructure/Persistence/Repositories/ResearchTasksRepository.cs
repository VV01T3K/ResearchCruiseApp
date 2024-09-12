using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;


internal class ResearchTasksRepository : Repository<ResearchTask>, IResearchTasksRepository
{
    public ResearchTasksRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }
}