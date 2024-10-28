using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;


public interface ISpubTasksRepository : IRepository<SpubTask>
{
    Task<int> CountFormASpubTasks(SpubTask spubTask, CancellationToken cancellationToken);
    
    Task<int> CountUniqueFormsC(SpubTask spubTask, CancellationToken cancellationToken);
}