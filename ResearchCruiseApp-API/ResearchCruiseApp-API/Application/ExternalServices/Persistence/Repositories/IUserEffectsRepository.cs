using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;


public interface IUserEffectsRepository : IRepository<UserEffect>
{
    Task<List<UserEffect>> GetAllByUserIdWithCruiseApplication(Guid userId, CancellationToken cancellationToken);
    
    Task<int> GetPointsSumByUserId(Guid userId, CancellationToken cancellationToken);
}