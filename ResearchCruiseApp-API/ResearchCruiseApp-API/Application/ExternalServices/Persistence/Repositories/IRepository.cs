namespace ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;


public interface IRepository<T>
{
    Task<List<T>> GetList(CancellationToken cancellationToken);
}