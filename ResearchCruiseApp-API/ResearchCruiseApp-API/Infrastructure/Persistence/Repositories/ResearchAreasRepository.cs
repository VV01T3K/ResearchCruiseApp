using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Repositories;


internal class ResearchAreasRepository : Repository<ResearchArea>, IResearchAreasRepository
{
    public ResearchAreasRepository(ApplicationDbContext dbContext) : base(dbContext)
    { }

    
    public Task<List<ResearchArea>> GetAllActive(CancellationToken cancellationToken)
    {
        return DbContext.ResearchAreas
            .Where(researchArea => researchArea.IsActive)
            .ToListAsync(cancellationToken);
    }
}