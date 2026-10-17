using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace ResearchCruiseApp.IntegrationTests.Infrastructure;

// Interleaves two requests deterministically. Once armed, it holds the first save that
// matches: that request has read and checked its state but written nothing yet. The test
// then sends a second request against the same state, and releases the first once the
// second has finished or is waiting on the first one's locks. The held request is made the
// one SQL Server keeps if the two deadlock, so the outcome does not depend on its choice.
internal sealed class SaveChangesGate : SaveChangesInterceptor
{
    private Func<DbContext, bool>? _match;

    internal TaskCompletionSource Reached { get; } =
        new(TaskCreationOptions.RunContinuationsAsynchronously);

    internal TaskCompletionSource Released { get; } =
        new(TaskCreationOptions.RunContinuationsAsynchronously);

    internal void Hold(Func<DbContext, bool> match) => _match = match;

    public override async ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default
    )
    {
        var db = eventData.Context!;
        db.ChangeTracker.DetectChanges();
        var match = _match;
        if (match is not null && match(db) && Interlocked.Exchange(ref _match, null) is not null)
        {
            await db.Database.ExecuteSqlRawAsync("SET DEADLOCK_PRIORITY HIGH", cancellationToken);
            Reached.TrySetResult();
            await Released.Task.WaitAsync(TimeSpan.FromSeconds(30), cancellationToken);
        }

        return result;
    }

    // Sends the second request while the first is held, and returns both responses.
    internal async Task<(HttpResponseMessage Held, HttpResponseMessage Other)> Race(
        string connectionString,
        Task<HttpResponseMessage> held,
        Func<Task<HttpResponseMessage>> other,
        CancellationToken cancellationToken
    )
    {
        Task<HttpResponseMessage>? otherTask = null;
        try
        {
            await Task.WhenAny(Reached.Task, held)
                .WaitAsync(TimeSpan.FromSeconds(30), cancellationToken);
            Assert.True(Reached.Task.IsCompleted, "The first request never reached its save.");
            otherTask = other();
            using var stop = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
            var blocked = WaitUntilBlocked(connectionString, stop.Token);
            await Task.WhenAny(otherTask, blocked)
                .WaitAsync(TimeSpan.FromSeconds(30), cancellationToken);
            await stop.CancelAsync();
            // Only wait for the lock probe to stop; its cancellation is expected.
            await Task.WhenAny(blocked);
        }
        finally
        {
            Released.TrySetResult();
        }

        return (await held, await otherTask!);
    }

    private static async Task WaitUntilBlocked(
        string connectionString,
        CancellationToken cancellationToken
    )
    {
        await using var connection = new SqlConnection(connectionString);
        await connection.OpenAsync(cancellationToken);
        await using var command = connection.CreateCommand();
        command.CommandText =
            "SELECT COUNT(*) FROM sys.dm_exec_requests WHERE database_id = DB_ID() AND blocking_session_id <> 0";
        while ((int)(await command.ExecuteScalarAsync(cancellationToken))! == 0)
            await Task.Delay(TimeSpan.FromMilliseconds(20), cancellationToken);
    }
}
