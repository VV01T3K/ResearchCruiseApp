using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;


public interface IUserEffectsRepository : IRepository<UserEffect>
{
    Task<List<UserEffect>> GetAllByUserIdWithCruiseApplication(Guid userId, CancellationToken cancellationToken);
    
    Task<int> GetPointsSumByUserId(Guid userId, CancellationToken cancellationToken);
}