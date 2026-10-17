using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Infrastructure.Persistence;

namespace ResearchCruiseApp.Infrastructure.Api;

public static class TransactionFilters
{
    // Concurrent check-then-write requests can't both act on old state; the deadlock victim gets 409.
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
