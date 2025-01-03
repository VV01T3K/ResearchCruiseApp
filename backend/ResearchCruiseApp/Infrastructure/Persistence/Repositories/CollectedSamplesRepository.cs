using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Persistence.Repositories;

internal class CollectedSamplesRepository : Repository<CollectedSample>, ICollectedSamplesRepository
{
    public CollectedSamplesRepository(ApplicationDbContext dbContext)
        : base(dbContext) { }
}
