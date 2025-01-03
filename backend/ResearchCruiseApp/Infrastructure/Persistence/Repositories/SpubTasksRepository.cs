using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Infrastructure.Persistence.Repositories;

internal class SpubTasksRepository : Repository<SpubTask>, ISpubTasksRepository
{
    public SpubTasksRepository(ApplicationDbContext dbContext)
        : base(dbContext) { }

    public Task<int> CountFormASpubTasks(SpubTask spubTask, CancellationToken cancellationToken)
    {
        return DbContext
            .SpubTasks.Where(s => s.Id == spubTask.Id)
            .SelectMany(s => s.FormASpubTasks)
            .CountAsync(cancellationToken);
    }

    public Task<int> CountUniqueFormsA(SpubTask spubTask, CancellationToken cancellationToken)
    {
        return DbContext
            .SpubTasks.Where(s => s.Id == spubTask.Id)
            .SelectMany(s => s.FormASpubTasks)
            .Select(fs => fs.FormA.Id)
            .Distinct()
            .CountAsync(cancellationToken);
    }

    public Task<int> CountUniqueFormsC(SpubTask spubTask, CancellationToken cancellationToken)
    {
        return DbContext
            .SpubTasks.Where(s => s.Id == spubTask.Id)
            .SelectMany(s => s.FormsC)
            .Select(f => f.Id)
            .Distinct()
            .CountAsync(cancellationToken);
    }
}
