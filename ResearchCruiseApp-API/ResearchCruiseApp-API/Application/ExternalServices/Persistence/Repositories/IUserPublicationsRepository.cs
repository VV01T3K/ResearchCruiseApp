using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;

public interface IUserPublicationsRepository : IRepository<UserPublication>
{
    Task<List<UserPublication>> GetAllByUserId(Guid userId, CancellationToken cancellationToken);
    
    Task<UserPublication?> GetPublicationByUserIdAndPublicationId(Guid userId, Guid publicationId, CancellationToken cancellationToken);

    Task<bool> CheckIfExists(Publication publication);
}