using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;

internal class SpubTasksRepository : Repository<SpubTask>, ISpubTasksRepository
{
    public SpubTasksRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }
}