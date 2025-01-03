using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Persistence.Repositories;

internal class ResearchTasksRepository : Repository<ResearchTask>, IResearchTasksRepository
{
    public ResearchTasksRepository(ApplicationDbContext dbContext)
        : base(dbContext) { }

    public Task<int> CountFormAResearchTasks(
        ResearchTask researchTask,
        CancellationToken cancellationToken
    )
    {
        return DbContext
            .ResearchTasks.Where(r => r.Id == researchTask.Id)
            .SelectMany(r => r.FormAResearchTasks)
            .CountAsync(cancellationToken);
    }

    public Task<int> CountUniqueFormsA(
        ResearchTask researchTask,
        CancellationToken cancellationToken
    )
    {
        return DbContext
            .ResearchTasks.Where(r => r.Id == researchTask.Id)
            .SelectMany(r => r.FormAResearchTasks)
            .Select(fr => fr.FormA.Id)
            .Distinct()
            .CountAsync(cancellationToken);
    }

    public Task<int> CountResearchTaskEffects(
        ResearchTask researchTask,
        CancellationToken cancellationToken
    )
    {
        return DbContext
            .ResearchTasks.Where(r => r.Id == researchTask.Id)
            .SelectMany(r => r.ResearchTasksEffects)
            .CountAsync(cancellationToken);
    }

    public Task<int> CountUniqueFormsC(
        ResearchTask researchTask,
        CancellationToken cancellationToken
    )
    {
        return DbContext
            .ResearchTasks.Where(r => r.Id == researchTask.Id)
            .SelectMany(r => r.ResearchTasksEffects)
            .Select(e => e.FormC.Id)
            .Distinct()
            .CountAsync(cancellationToken);
    }
}
