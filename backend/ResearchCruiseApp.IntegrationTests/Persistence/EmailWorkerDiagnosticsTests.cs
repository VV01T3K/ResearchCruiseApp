using System.Collections.Concurrent;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using ResearchCruiseApp.Infrastructure.Email;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Persistence;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class EmailWorkerDiagnosticsTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    [Fact]
    public async Task Worker_WhenOutboxTableIsMissing_LogsSqlErrorAndRecovers()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var logger = new RecordingLogger();
        var worker = new EmailOutboxWorker(
            app.Services.GetRequiredService<IServiceScopeFactory>(),
            logger
        );
        await RenameOutbox("EmailOutboxMessages", "EmailOutboxMessagesOffline");
        await worker.StartAsync(ct);
        try
        {
            try
            {
                await WaitUntil(() => Task.FromResult(!logger.Entries.IsEmpty), ct);
            }
            finally
            {
                await RenameOutbox("EmailOutboxMessagesOffline", "EmailOutboxMessages");
            }

            var (exception, state) = logger.Entries.First();
            Assert.Equal(208, Assert.IsType<SqlException>(exception).Number);
            Assert.Contains(
                state,
                pair =>
                    pair.Key == "SqlErrorNumbers"
                    && pair.Value is int[] numbers
                    && numbers.Contains(208)
            );

            await app.Enqueue("worker@example.invalid", "Worker", "Recovered body");
            await WaitUntil(
                async () =>
                {
                    await using var db = fixture.CreateDbContext();
                    return !await db.EmailOutboxMessages.AnyAsync(ct);
                },
                ct
            );
        }
        finally
        {
            await worker.StopAsync(CancellationToken.None);
        }
        Assert.Equal("Recovered body", Assert.Single(app.Transport.Messages).Payload.Body);
    }

    private async Task RenameOutbox(string from, string to)
    {
        await using var db = fixture.CreateDbContext();
        await db.Database.ExecuteSqlAsync($"EXEC sp_rename {from}, {to}");
    }

    private static async Task WaitUntil(Func<Task<bool>> condition, CancellationToken ct)
    {
        using var timeout = CancellationTokenSource.CreateLinkedTokenSource(ct);
        timeout.CancelAfter(TimeSpan.FromSeconds(30));
        while (!await condition())
            await Task.Delay(100, timeout.Token);
    }

    private sealed class RecordingLogger : ILogger<EmailOutboxWorker>
    {
        internal ConcurrentQueue<(
            Exception? Exception,
            IReadOnlyList<KeyValuePair<string, object?>> State
        )> Entries { get; } = new();

        public IDisposable? BeginScope<TState>(TState state)
            where TState : notnull => null;

        public bool IsEnabled(LogLevel logLevel) => true;

        public void Log<TState>(
            LogLevel logLevel,
            EventId eventId,
            TState state,
            Exception? exception,
            Func<TState, Exception?, string> formatter
        ) =>
            Entries.Enqueue(
                (exception, state as IReadOnlyList<KeyValuePair<string, object?>> ?? [])
            );
    }
}
