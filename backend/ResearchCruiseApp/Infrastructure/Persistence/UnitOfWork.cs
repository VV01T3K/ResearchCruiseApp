using System.Data;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Application.ExternalServices.Persistence;

namespace ResearchCruiseApp.Infrastructure.Persistence;

internal class UnitOfWork(ApplicationDbContext applicationDbContext) : IUnitOfWork
{
    public Task Complete(CancellationToken cancellationToken)
    {
        return applicationDbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task ExecuteIsolated(Func<Task> action, CancellationToken cancellationToken)
    {
        await using var transaction = await applicationDbContext.Database.BeginTransactionAsync(
            IsolationLevel.Serializable,
            cancellationToken
        );
        try
        {
            await action();
            await transaction.CommitAsync(cancellationToken);
        }
        catch (Exception)
        {
            await transaction.RollbackAsync(cancellationToken);
            throw;
        }
    }

    public async Task<TResult> ExecuteIsolated<TResult>(
        Func<Task<TResult>> action,
        CancellationToken cancellationToken
    )
    {
        await using var transaction = await applicationDbContext.Database.BeginTransactionAsync(
            IsolationLevel.Serializable,
            cancellationToken
        );
        try
        {
            var result = await action();
            await transaction.CommitAsync(cancellationToken);
            return result;
        }
        catch (Exception)
        {
            await transaction.RollbackAsync(cancellationToken);
            throw;
        }
    }
}
