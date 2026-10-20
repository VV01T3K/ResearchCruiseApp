using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging.Testing;
using ResearchCruiseApp.Infrastructure.Email;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Persistence;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class EmailWorkerDiagnosticsTests(SqlFixture fixture)
{
    [Fact]
    public async Task Worker_WhenOutboxTableIsMissing_LogsSqlError()
    {
        using var cts = CancellationTokenSource.CreateLinkedTokenSource(
            TestContext.Current.CancellationToken
        );
        cts.CancelAfter(TimeSpan.FromSeconds(30));
        var ct = cts.Token;
        await using var app = new TestApplication(fixture.ConnectionString);
        await using var db = fixture.CreateDbContext();
        var logger = new FakeLogger<EmailOutboxWorker>();
        var scopes = app.Services.GetRequiredService<IServiceScopeFactory>();
        var worker = new EmailOutboxWorker(scopes, logger);
        await db.Database.ExecuteSqlRawAsync("EXEC sp_rename EmailOutboxMessages, Offline", ct);
        try
        {
            await worker.StartAsync(ct);
            var log = await logger.Collector.GetLogsAsync(ct).FirstAsync(ct);
            Assert.Equal(208, Assert.IsType<SqlException>(log.Exception).Number);
            Assert.Equal("[\"208\"]", log.GetStructuredStateValue("SqlErrorNumbers"));
        }
        finally
        {
            await worker.StopAsync(CancellationToken.None);
            await db.Database.ExecuteSqlRawAsync(
                "EXEC sp_rename Offline, EmailOutboxMessages",
                CancellationToken.None
            );
        }
    }
}
