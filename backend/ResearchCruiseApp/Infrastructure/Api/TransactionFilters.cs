using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Infrastructure.Persistence;

namespace ResearchCruiseApp.Infrastructure.Api;

public static class TransactionFilters
{
    // For endpoints that check state and then change it, such as a cruise or application
    // status. Serializable isolation keeps what the request read unchanged until it commits,
    // so concurrent requests cannot both act on the same old state. SQL Server resolves the
    // clash by aborting one of them as a deadlock victim, which is answered with a conflict.
    public static RouteHandlerBuilder WithSerializableTransaction(this RouteHandlerBuilder builder)
    {
        return builder
            .AddEndpointFilter<SerializableTransactionFilter>()
            .ProducesProblem(StatusCodes.Status409Conflict);
    }
}

internal sealed class SerializableTransactionFilter(ApplicationDbContext dbContext)
    : IEndpointFilter
{
    private const int DeadlockVictim = 1205;

    public async ValueTask<object?> InvokeAsync(
        EndpointFilterInvocationContext context,
        EndpointFilterDelegate next
    )
    {
        var cancellationToken = context.HttpContext.RequestAborted;

        try
        {
            await using var transaction = await dbContext.Database.BeginTransactionAsync(
                IsolationLevel.Serializable,
                cancellationToken
            );

            var result = await next(context);

            // Disposing the transaction rolls back whatever a rejected request saved.
            if (Succeeded(result))
            {
                await dbContext.SaveChangesAsync(cancellationToken);
                await transaction.CommitAsync(cancellationToken);
            }

            return result;
        }
        catch (Exception exception) when (IsDeadlockVictim(exception))
        {
            return Error
                .Conflict(
                    "Dane zostały w międzyczasie zmienione przez inną operację. Odśwież stronę i spróbuj ponownie."
                )
                .ToProblemHttpResult();
        }
    }

    private static bool Succeeded(object? result) =>
        (result is INestedHttpResult nested ? nested.Result : result)
            is not IStatusCodeHttpResult { StatusCode: >= 400 };

    private static bool IsDeadlockVictim(Exception? exception)
    {
        for (; exception is not null; exception = exception.InnerException)
        {
            if (
                exception is SqlException sqlException
                && sqlException.Errors.Cast<SqlError>().Any(error => error.Number == DeadlockVictim)
            )
            {
                return true;
            }
        }

        return false;
    }
}
