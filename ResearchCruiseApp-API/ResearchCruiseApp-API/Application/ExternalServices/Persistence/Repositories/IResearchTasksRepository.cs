using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;


public interface IResearchTasksRepository : IRepository<ResearchTask>
{
    Task<int> CountFormAResearchTasks(ResearchTask researchTask, CancellationToken cancellationToken);

    Task<int> CountUniqueFormsA(ResearchTask researchTask, CancellationToken cancellationToken);

    Task<int> CountResearchTaskEffects(ResearchTask researchTask, CancellationToken cancellationToken);
    
    Task<int> CountUniqueFormsC(ResearchTask researchTask, CancellationToken cancellationToken);
}