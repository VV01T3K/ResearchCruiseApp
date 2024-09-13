using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;


internal class UgUnitsRepository : Repository<UgUnit>, IUgUnitsRepository
{
    public UgUnitsRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }
}