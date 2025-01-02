namespace ResearchCruiseApp.Application.ExternalServices.Persistence;


public interface IUnitOfWork
{
    Task Complete(CancellationToken cancellationToken);
    
    Task ExecuteIsolated(Func<Task> action, CancellationToken cancellationToken);
    
    Task<TResult> ExecuteIsolated<TResult>(Func<Task<TResult>> action, CancellationToken cancellationToken);
}