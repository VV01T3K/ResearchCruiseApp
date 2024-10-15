using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;


internal class UgUnitsRepository : Repository<UgUnit>, IUgUnitsRepository
{
    public UgUnitsRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }


    public Task<List<UgUnit>> GetAllActive(CancellationToken cancellationToken)
    {
        return DbContext.UgUnits
            .Where(ugUnit => ugUnit.IsActive)
            .ToListAsync(cancellationToken);
    }
}