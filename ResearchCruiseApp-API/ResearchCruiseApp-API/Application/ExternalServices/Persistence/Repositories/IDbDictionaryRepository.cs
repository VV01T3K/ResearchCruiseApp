using ResearchCruiseApp_API.Domain.Common.Interfaces;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;


public interface IDbDictionaryRepository<T>
    where T : Entity, IDbDictionary
{
    Task<List<T>> GetAllActive(CancellationToken cancellationToken);
}