namespace ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;


public interface IRepository<T>
{
    Task<List<T>> GetAll(CancellationToken cancellationToken);
    Task<T?> GetById(Guid id, CancellationToken cancellationToken);
    Task Add(T newEntity, CancellationToken cancellationToken);
}