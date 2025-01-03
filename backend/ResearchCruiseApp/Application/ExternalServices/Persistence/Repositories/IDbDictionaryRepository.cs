using ResearchCruiseApp.Domain.Common.Interfaces;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;

public interface IDbDictionaryRepository<T>
    where T : Entity, IDictionaryEntity
{
    Task<List<T>> GetAllActive(CancellationToken cancellationToken);
}
