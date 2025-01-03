using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;

public interface IPublicationsRepository : IRepository<Publication>
{
    Task<int> CountFormAPublications(Publication publication, CancellationToken cancellationToken);

    Task<int> CountUserPublications(Publication publication, CancellationToken cancellationToken);

    Task<int> CountUniqueFormsA(Publication publication, CancellationToken cancellationToken);
}
