using ResearchCruiseApp.Domain.Common.Interfaces;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;


public interface IRepository<T>
    where T : Entity
{
    Task<List<T>> GetAll(CancellationToken cancellationToken);
    
    Task<T?> GetById(Guid id, CancellationToken cancellationToken);
    
    Task<TUniqueEntity?> Get<TUniqueEntity>(TUniqueEntity searchedEntity, CancellationToken cancellationToken)
        where TUniqueEntity : T, IEquatableByExpression<TUniqueEntity>;
    
    Task Add(T newEntity, CancellationToken cancellationToken);
    
    Task UpdateOrAdd(T newEntity, CancellationToken cancellationToken);

    void Delete(T entity);
}