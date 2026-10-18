using Microsoft.Data.SqlClient;

namespace ResearchCruiseApp.Infrastructure.Email;

internal sealed class EmailOutboxWorker(
    IServiceScopeFactory scopeFactory,
    ILogger<EmailOutboxWorker> logger
) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await using var scope = scopeFactory.CreateAsyncScope();
                await scope
                    .ServiceProvider.GetRequiredService<EmailOutboxDispatcher>()
                    .DispatchBatch(stoppingToken);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                return;
            }
            catch (Exception exception) when (FindSqlException(exception) is { } sqlException)
            {
                logger.LogError(
                    exception,
                    "Email outbox database operation failed (SQL errors {SqlErrorNumbers}); processing will retry",
                    sqlException.Errors.Cast<SqlError>().Select(error => error.Number).ToArray()
                );
            }
            catch (Exception exception)
            {
                logger.LogError(
                    "Email outbox processing failed ({FailureType}); processing will retry",
                    exception.GetType().Name
                );
            }

            await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
        }
    }

    private static SqlException? FindSqlException(Exception? exception)
    {
        for (; exception is not null; exception = exception.InnerException)
            if (exception is SqlException sqlException)
                return sqlException;
        return null;
    }
}
