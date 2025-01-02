using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;

public interface IUserPublicationsRepository : IRepository<UserPublication>
{
    Task<List<UserPublication>> GetAllByUserId(Guid userId, CancellationToken cancellationToken);
    
    Task<UserPublication?> GetPublicationByUserIdAndPublicationId(Guid userId, Guid publicationId, CancellationToken cancellationToken);

    Task<bool> CheckIfExists(Publication publication);
}