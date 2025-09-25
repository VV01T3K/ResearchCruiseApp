using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;

public interface IResearchAreaDescriptionsRepository : IRepository<ResearchAreaDescription>
{
    Task<int> CountFormsA(
        ResearchAreaDescription researchAreaDescription,
        CancellationToken cancellationToken
    );
    Task<int> CountFormsC(
        ResearchAreaDescription researchAreaDescription,
        CancellationToken cancellationToken
    );
}
