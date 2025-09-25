using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Persistence.Repositories;

internal class ResearchAreasRepository : Repository<ResearchArea>, IResearchAreasRepository
{
    public ResearchAreasRepository(ApplicationDbContext dbContext)
        : base(dbContext) { }

    public Task<List<ResearchArea>> GetAllActive(CancellationToken cancellationToken)
    {
        return DbContext
            .ResearchAreas.Where(researchArea => researchArea.IsActive)
            .ToListAsync(cancellationToken);
    }

    public async Task<ResearchArea?> GetByName(string name, CancellationToken cancellationToken)
    {
        return await DbContext.ResearchAreas.FirstOrDefaultAsync(
            ra => ra.Name == name,
            cancellationToken
        );
    }
}
