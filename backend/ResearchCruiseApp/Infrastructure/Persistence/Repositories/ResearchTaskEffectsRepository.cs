using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Persistence.Repositories;

internal class ResearchTaskEffectsRepository
    : Repository<ResearchTaskEffect>,
        IResearchTaskEffectsRepository
{
    public ResearchTaskEffectsRepository(ApplicationDbContext dbContext)
        : base(dbContext) { }
}
