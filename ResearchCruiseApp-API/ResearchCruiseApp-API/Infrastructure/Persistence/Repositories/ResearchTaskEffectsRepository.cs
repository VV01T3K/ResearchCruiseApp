using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;


internal class ResearchTaskEffectsRepository : Repository<ResearchTaskEffect>, IResearchTaskEffectsRepository
{
    public ResearchTaskEffectsRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }
}