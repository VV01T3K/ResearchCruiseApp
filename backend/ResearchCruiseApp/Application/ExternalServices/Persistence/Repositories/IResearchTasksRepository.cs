using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;

public interface IResearchTasksRepository : IRepository<ResearchTask>
{
    Task<int> CountFormAResearchTasks(
        ResearchTask researchTask,
        CancellationToken cancellationToken
    );

    Task<int> CountUniqueFormsA(ResearchTask researchTask, CancellationToken cancellationToken);

    Task<int> CountResearchTaskEffects(
        ResearchTask researchTask,
        CancellationToken cancellationToken
    );

    Task<int> CountUniqueFormsC(ResearchTask researchTask, CancellationToken cancellationToken);
}
