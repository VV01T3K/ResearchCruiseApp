using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Persistence.Repositories;


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