using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Infrastructure.Persistence;

namespace ResearchCruiseApp.Api;

public static class TransactionFilters
{
    public static RouteHandlerBuilder WithDbTransaction(this RouteHandlerBuilder builder)
    {
        return builder.AddEndpointFilter<DbTransactionFilter>();
    }
}

internal sealed class DbTransactionFilter(ApplicationDbContext dbContext) : IEndpointFilter
{
    public async ValueTask<object?> InvokeAsync(
        EndpointFilterInvocationContext context,
        EndpointFilterDelegate next
    )
    {
        if (dbContext.Database.CurrentTransaction is not null)
        {
            return await next(context);
        }

        var cancellationToken = context.HttpContext.RequestAborted;

        await using var transaction = await dbContext.Database.BeginTransactionAsync(
            cancellationToken
        );

        var result = await next(context);

        await dbContext.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        return result;
    }
}
