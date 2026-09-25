using System.Diagnostics;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Infrastructure.Persistence;
using Respawn;
using Respawn.Graph;
using Testcontainers.MsSql;

namespace ResearchCruiseApp.IntegrationTests.Infrastructure;

[CollectionDefinition(Name)]
public sealed class SqlTestCollectionDefinition : ICollectionFixture<SqlFixture>
{
    public const string Name = "SQL Server";
}

public sealed class SqlFixture : IAsyncLifetime
{
    public const string Image =
        "mcr.microsoft.com/mssql/server:2022-latest@sha256:4402d880dd4c34bfa7d8705e56a86cd6c88da80a1f6bbbe741f999e76264a090";
    private readonly MsSqlContainer _container = new MsSqlBuilder(Image)
        .WithPassword($"Test!{Guid.NewGuid():N}")
        .Build();
    private readonly string _database = $"ResearchCruiseTests_{Guid.NewGuid():N}";
    private Respawner? _respawner;

    internal string ConnectionString { get; private set; } = "";

    internal ApplicationDbContext CreateDbContext() =>
        new(
            new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseSqlServer(ConnectionString)
                .Options
        );

    public async ValueTask InitializeAsync()
    {
        try
        {
            using var startup = new CancellationTokenSource(TimeSpan.FromMinutes(2));
            var phase = Stopwatch.StartNew();
            await _container.StartAsync(startup.Token);
            Console.WriteLine($"SQL startup: {phase.Elapsed.TotalMilliseconds:F0} ms");
            phase.Restart();
            ConnectionString = new SqlConnectionStringBuilder(_container.GetConnectionString())
            {
                InitialCatalog = _database,
            }.ConnectionString;
            await using var db = CreateDbContext();
            await db.Database.MigrateAsync(startup.Token);
            Console.WriteLine($"SQL migrations: {phase.Elapsed.TotalMilliseconds:F0} ms");
            phase.Restart();
            await using var connection = await OpenOwnedConnection();
            _respawner = await Respawner.CreateAsync(
                connection,
                new RespawnerOptions
                {
                    DbAdapter = DbAdapter.SqlServer,
                    TablesToIgnore = [new Table("__EFMigrationsHistory")],
                }
            );
            Console.WriteLine($"SQL reset planning: {phase.Elapsed.TotalMilliseconds:F0} ms");
            await using var command = connection.CreateCommand();
            command.CommandText =
                "SELECT CONVERT(nvarchar(128), DATABASEPROPERTYEX(DB_NAME(), 'Collation')), compatibility_level FROM sys.databases WHERE name = DB_NAME()";
            await using var reader = await command.ExecuteReaderAsync(startup.Token);
            await reader.ReadAsync(startup.Token);
            Console.WriteLine(
                $"SQL fixture: collation={reader.GetString(0)}, compatibility={reader.GetByte(1)}"
            );
        }
        catch
        {
            await CaptureLogs();
            await _container.DisposeAsync();
            throw;
        }
    }

    internal async Task ResetAsync()
    {
        var elapsed = Stopwatch.StartNew();
        await using var connection = await OpenOwnedConnection();
        await (
            _respawner ?? throw new InvalidOperationException("SQL fixture did not initialize.")
        ).ResetAsync(connection);
        Console.WriteLine($"SQL reset: {elapsed.Elapsed.TotalMilliseconds:F0} ms");
    }

    private async Task<SqlConnection> OpenOwnedConnection()
    {
        await using var db = CreateDbContext();
        if (!db.Database.IsSqlServer() || db.Database.GetDbConnection().Database != _database)
            throw new InvalidOperationException(
                "Refusing to reset a database not owned by this fixture."
            );
        var connection = new SqlConnection(ConnectionString);
        try
        {
            await connection.OpenAsync();
            if (
                connection.Database != _database
                || connection.DataSource
                    != new SqlConnectionStringBuilder(_container.GetConnectionString()).DataSource
            )
                throw new InvalidOperationException(
                    "SQL connection is outside the fixture container."
                );
            return connection;
        }
        catch
        {
            await connection.DisposeAsync();
            throw;
        }
    }

    private async Task CaptureLogs()
    {
        try
        {
            var (stdout, stderr) = await _container.GetLogsAsync();
            var directory = Path.GetFullPath("artifacts/sql");
            Directory.CreateDirectory(directory);
            await File.WriteAllTextAsync(Path.Combine(directory, "container.log"), stdout + stderr);
        }
        catch (Exception exception)
        {
            Console.Error.WriteLine(
                $"Could not collect SQL container logs ({exception.GetType().Name})."
            );
        }
    }

    public async ValueTask DisposeAsync()
    {
        await CaptureLogs();
        await _container.DisposeAsync();
    }
}
