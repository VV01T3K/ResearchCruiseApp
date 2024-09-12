using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;


internal class GuestUnitsRepository : Repository<GuestUnit>, IGuestUnitsRepository
{
    public GuestUnitsRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }
}