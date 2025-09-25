using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Persistence.Repositories;

internal class ResearchAreaDescriptionsRepository
    : Repository<ResearchAreaDescription>,
        IResearchAreaDescriptionsRepository
{
    public ResearchAreaDescriptionsRepository(ApplicationDbContext dbContext)
        : base(dbContext) { }

    public async Task<int> CountFormsA(
        ResearchAreaDescription researchAreaDescription,
        CancellationToken cancellationToken
    )
    {
        return await DbContext
            .ResearchAreaDescriptions.Where(r => r.Id == researchAreaDescription.Id)
            .SelectMany(r => r.FormsA)
            .CountAsync(cancellationToken);
    }

    public async Task<int> CountFormsC(
        ResearchAreaDescription researchAreaDescription,
        CancellationToken cancellationToken
    )
    {
        return await DbContext
            .ResearchAreaDescriptions.Where(r => r.Id == researchAreaDescription.Id)
            .SelectMany(r => r.FormsC)
            .CountAsync(cancellationToken);
    }
}
