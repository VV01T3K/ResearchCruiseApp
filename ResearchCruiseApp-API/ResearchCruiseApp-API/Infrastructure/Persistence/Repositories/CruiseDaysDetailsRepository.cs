using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;


internal class CruiseDaysDetailsRepository : Repository<CruiseDayDetails>, ICruiseDaysDetailsRepository
{
    public CruiseDaysDetailsRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }
}