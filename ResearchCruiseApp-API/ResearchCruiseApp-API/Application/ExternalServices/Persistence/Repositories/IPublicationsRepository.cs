using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;


public interface IPublicationsRepository : IRepository<Publication>
{
    Task<int> CountFormAPublications(Publication publication, CancellationToken cancellationToken);
    
    Task<int> CountUserPublications(Publication publication, CancellationToken cancellationToken);
    
    Task<int> CountUniqueFormsA(Publication publication, CancellationToken cancellationToken);
}