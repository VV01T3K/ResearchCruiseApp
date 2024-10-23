using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;


internal class CruiseDaysDetailsRepository : Repository<CruiseDayDetails>, ICruiseDaysDetailsRepository
{
    public CruiseDaysDetailsRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }


    public Task<int> CountUniqueFormsC(CruiseDayDetails cruiseDayDetails, CancellationToken cancellationToken)
    {
        return DbContext.CruiseDaysDetails
            .Where(c => c.Id == cruiseDayDetails.Id)
            .SelectMany(c => c.FormsC)
            .Select(f => f.Id)
            .Distinct()
            .CountAsync(cancellationToken);
    }
    
    public Task<int> CountUniqueFormsB(CruiseDayDetails cruiseDayDetails, CancellationToken cancellationToken)
    {
        return DbContext.CruiseDaysDetails
            .Where(c => c.Id == cruiseDayDetails.Id)
            .SelectMany(c => c.FormsB)
            .Select(f => f.Id)
            .Distinct()
            .CountAsync(cancellationToken);
    }
}