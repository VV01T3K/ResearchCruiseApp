using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;

public interface ISpubTasksRepository : IRepository<SpubTask>
{
    Task<int> CountFormASpubTasks(SpubTask spubTask, CancellationToken cancellationToken);

    Task<int> CountUniqueFormsA(SpubTask spubTask, CancellationToken cancellationToken);

    Task<int> CountUniqueFormsC(SpubTask spubTask, CancellationToken cancellationToken);
}
