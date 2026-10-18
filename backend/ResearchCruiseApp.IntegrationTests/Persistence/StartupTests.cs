using System.Data.Common;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Persistence.Initialization;
using ResearchCruiseApp.Infrastructure.Persistence.Initialization.InitialData;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Persistence;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class StartupTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public async Task Seed_WhenReferenceDataIsPartial_PreservesExistingRows(bool seedAccounts)
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var configuration = new ConfigurationBuilder().AddInMemoryCollection().Build();
        configuration["Database:SeedAccountsAutomatically"] = seedAccounts.ToString();
        if (!seedAccounts)
        {
            configuration["Users:0:Email"] = "ignored@example.invalid";
            configuration["Users:0:Role"] = "Administrator";
        }
        var unit = new UgUnit { Name = SeedUgUnitData.UgUnitsNames[0], IsActive = false };
        var area = new ResearchArea
        {
            Name = SeedResearchAreaData.ResearchAreaNames[0],
            IsActive = false,
        };
        var equipment = new ShipEquipment
        {
            Name = SeedShipEquipmentData.ShipEquipmentsNames[0],
            IsActive = false,
        };
        var custom = new UgUnit { Name = "Custom research unit", IsActive = true };
        await app.InDatabase(async db =>
        {
            db.AddRange(unit, area, equipment, custom);
            await db.SaveChangesAsync(ct);
        });
        for (var attempt = 0; attempt < 2; attempt++)
        {
            await using var scope = app.Services.CreateAsyncScope();
            await ActivatorUtilities
                .CreateInstance<ApplicationDbContextInitializer>(
                    scope.ServiceProvider,
                    configuration
                )
                .Seed();
            await app.InDatabase(async db =>
            {
                Assert.Equal(
                    SeedUgUnitData
                        .UgUnitsNames.Append(custom.Name)
                        .Distinct(StringComparer.Ordinal)
                        .Order(StringComparer.Ordinal),
                    (await db.UgUnits.Select(row => row.Name).ToArrayAsync(ct)).Order(
                        StringComparer.Ordinal
                    )
                );
                Assert.Equal(
                    SeedResearchAreaData
                        .ResearchAreaNames.Distinct(StringComparer.Ordinal)
                        .Order(StringComparer.Ordinal),
                    (await db.ResearchAreas.Select(row => row.Name).ToArrayAsync(ct)).Order(
                        StringComparer.Ordinal
                    )
                );
                Assert.Equal(
                    SeedShipEquipmentData
                        .ShipEquipmentsNames.Distinct(StringComparer.Ordinal)
                        .Order(StringComparer.Ordinal),
                    (await db.ShipEquipments.Select(row => row.Name).ToArrayAsync(ct)).Order(
                        StringComparer.Ordinal
                    )
                );
                Assert.Equal(
                    SeedAdministrationData.RoleNames.Order(StringComparer.Ordinal),
                    (await db.Roles.Select(row => row.Name).ToArrayAsync(ct)).Order(
                        StringComparer.Ordinal
                    )
                );
                Assert.False((await db.UgUnits.SingleAsync(row => row.Id == unit.Id, ct)).IsActive);
                Assert.False(
                    (await db.ResearchAreas.SingleAsync(row => row.Id == area.Id, ct)).IsActive
                );
                Assert.False(
                    (
                        await db.ShipEquipments.SingleAsync(row => row.Id == equipment.Id, ct)
                    ).IsActive
                );
                Assert.True(
                    (await db.UgUnits.SingleAsync(row => row.Id == custom.Id, ct)).IsActive
                );
                Assert.Empty(await db.Users.ToListAsync(ct));
                Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
            });
        }
        Assert.Empty(app.Transport.Messages);
    }

    [Fact]
    public async Task Initialize_WhenTwoHostsStart_SeedsReferenceDataWithoutDuplicateRowsOrAccounts()
    {
        var cancellationToken = TestContext.Current.CancellationToken;
        await using var first = new TestApplication(fixture.ConnectionString);
        await using var second = new TestApplication(fixture.ConnectionString);
        await using var firstScope = first.Services.CreateAsyncScope();
        await using var secondScope = second.Services.CreateAsyncScope();
        var firstInitializer =
            firstScope.ServiceProvider.GetRequiredService<ApplicationDbContextInitializer>();
        var secondInitializer =
            secondScope.ServiceProvider.GetRequiredService<ApplicationDbContextInitializer>();
        var start = new TaskCompletionSource(TaskCreationOptions.RunContinuationsAsynchronously);
        async Task Initialize(ApplicationDbContextInitializer initializer)
        {
            await start.Task;
            await initializer.Initialize();
        }
        var starts = new[] { Initialize(firstInitializer), Initialize(secondInitializer) };

        start.SetResult();
        await Task.WhenAll(starts);

        await using var verification = fixture.CreateDbContext();
        var units = await verification
            .UgUnits.Select(row => row.Name)
            .ToArrayAsync(cancellationToken);
        var areas = await verification
            .ResearchAreas.Select(row => row.Name)
            .ToArrayAsync(cancellationToken);
        var equipment = await verification
            .ShipEquipments.Select(row => row.Name)
            .ToArrayAsync(cancellationToken);
        var roles = await verification
            .Roles.Select(row => row.Name)
            .ToArrayAsync(cancellationToken);
        Assert.NotEmpty(units);
        Assert.NotEmpty(areas);
        Assert.NotEmpty(equipment);
        Assert.NotEmpty(roles);
        Assert.Equal(units.Length, units.Distinct(StringComparer.Ordinal).Count());
        Assert.Equal(areas.Length, areas.Distinct(StringComparer.Ordinal).Count());
        Assert.Equal(equipment.Length, equipment.Distinct(StringComparer.Ordinal).Count());
        Assert.Equal(roles.Length, roles.Distinct(StringComparer.Ordinal).Count());
        Assert.Empty(await verification.Users.ToListAsync(cancellationToken));
        Assert.Empty(await verification.EmailOutboxMessages.ToListAsync(cancellationToken));

        var removedName = units.Order(StringComparer.Ordinal).First();
        await verification
            .UgUnits.Where(row => row.Name == removedName)
            .ExecuteDeleteAsync(cancellationToken);
        await firstInitializer.Initialize();

        await using var repeated = fixture.CreateDbContext();
        Assert.Equal(
            units.Order(StringComparer.Ordinal),
            (await repeated.UgUnits.Select(row => row.Name).ToArrayAsync(cancellationToken)).Order(
                StringComparer.Ordinal
            )
        );
        Assert.Equal(
            roles.Order(StringComparer.Ordinal),
            (await repeated.Roles.Select(row => row.Name).ToArrayAsync(cancellationToken)).Order(
                StringComparer.Ordinal
            )
        );
    }

    [Fact]
    public async Task Initialize_WhenTwoHostsCreateAbsentDatabase_BothMigrateIt()
    {
        var cancellationToken = TestContext.Current.CancellationToken;
        var connectionString = new SqlConnectionStringBuilder(fixture.ConnectionString)
        {
            InitialCatalog = $"StartupRace_{Guid.NewGuid():N}",
        }.ConnectionString;
        var barrier = new CreateDatabaseBarrier();
        await using var first = new TestApplication(connectionString, interceptor: barrier);
        await using var second = new TestApplication(connectionString, interceptor: barrier);
        try
        {
            await using var firstScope = first.Services.CreateAsyncScope();
            await using var secondScope = second.Services.CreateAsyncScope();
            var results = await Task.WhenAll(
                    Initialize(firstScope.ServiceProvider),
                    Initialize(secondScope.ServiceProvider)
                )
                .WaitAsync(TimeSpan.FromMinutes(2), cancellationToken);

            Assert.All(results, Assert.Null);
            await first.InDatabase(async db =>
            {
                Assert.Empty(await db.Database.GetPendingMigrationsAsync(cancellationToken));
                Assert.NotEmpty(await db.Roles.ToListAsync(cancellationToken));
            });
        }
        finally
        {
            await first.InDatabase(db => db.Database.EnsureDeletedAsync(cancellationToken));
        }
    }

    [Fact]
    public async Task Initialize_WhenCreatedDatabaseStaysUnreachable_FailsWithinTimeout()
    {
        var cancellationToken = TestContext.Current.CancellationToken;
        var connectionString = new SqlConnectionStringBuilder(fixture.ConnectionString)
        {
            InitialCatalog = $"StartupRace_{Guid.NewGuid():N}",
        }.ConnectionString;
        var barrier = new CreateDatabaseBarrier();
        var timeProvider = new AcceleratedTimeProvider();
        await using var first = new TestApplication(
            connectionString,
            interceptor: new UnreachableAfterLosingRace(barrier)
        );
        await using var second = new TestApplication(
            connectionString,
            interceptor: new UnreachableAfterLosingRace(barrier)
        );
        try
        {
            await using var firstScope = first.Services.CreateAsyncScope();
            await using var secondScope = second.Services.CreateAsyncScope();
            var results = await Task.WhenAll(
                    Initialize(firstScope.ServiceProvider, timeProvider),
                    Initialize(secondScope.ServiceProvider, timeProvider)
                )
                .WaitAsync(TimeSpan.FromSeconds(30), cancellationToken);

            Assert.Single(results, result => result is null);
            Assert.Single(results, result => result is TimeoutException);
        }
        finally
        {
            await using var cleanup = new TestApplication(connectionString);
            await cleanup.InDatabase(db => db.Database.EnsureDeletedAsync(cancellationToken));
        }
    }

    private static async Task<Exception?> Initialize(
        IServiceProvider services,
        TimeProvider? timeProvider = null
    )
    {
        try
        {
            var initializer = timeProvider is null
                ? services.GetRequiredService<ApplicationDbContextInitializer>()
                : ActivatorUtilities.CreateInstance<ApplicationDbContextInitializer>(
                    services,
                    timeProvider
                );
            await initializer.Initialize();
            return null;
        }
        catch (Exception exception)
        {
            return exception;
        }
    }

    private sealed class AcceleratedTimeProvider : TimeProvider
    {
        public override ITimer CreateTimer(
            TimerCallback callback,
            object? state,
            TimeSpan dueTime,
            TimeSpan period
        ) => System.CreateTimer(callback, state, Accelerate(dueTime), Accelerate(period));

        private static TimeSpan Accelerate(TimeSpan duration) =>
            duration == Timeout.InfiniteTimeSpan ? duration : duration / 600;
    }

    private sealed class UnreachableAfterLosingRace(CreateDatabaseBarrier barrier)
        : DbCommandInterceptor,
            IDbConnectionInterceptor
    {
        private volatile bool _lostRace;

        public override ValueTask<InterceptionResult<int>> NonQueryExecutingAsync(
            DbCommand command,
            CommandEventData eventData,
            InterceptionResult<int> result,
            CancellationToken cancellationToken = default
        ) => barrier.NonQueryExecutingAsync(command, eventData, result, cancellationToken);

        public override Task CommandFailedAsync(
            DbCommand command,
            CommandErrorEventData eventData,
            CancellationToken cancellationToken = default
        )
        {
            if (eventData.Exception is SqlException { Number: 1801 })
                _lostRace = true;
            return Task.CompletedTask;
        }

        public async ValueTask<InterceptionResult> ConnectionOpeningAsync(
            DbConnection connection,
            ConnectionEventData eventData,
            InterceptionResult result,
            CancellationToken cancellationToken = default
        )
        {
            if (_lostRace)
                await Task.Delay(Timeout.InfiniteTimeSpan, cancellationToken);
            return result;
        }
    }

    private sealed class CreateDatabaseBarrier : DbCommandInterceptor
    {
        private readonly TaskCompletionSource _bothReached = new(
            TaskCreationOptions.RunContinuationsAsynchronously
        );
        private int _arrivals;

        public override async ValueTask<InterceptionResult<int>> NonQueryExecutingAsync(
            DbCommand command,
            CommandEventData eventData,
            InterceptionResult<int> result,
            CancellationToken cancellationToken = default
        )
        {
            if (command.CommandText.Contains("CREATE DATABASE", StringComparison.Ordinal))
            {
                if (Interlocked.Increment(ref _arrivals) == 2)
                    _bothReached.TrySetResult();
                await _bothReached.Task.WaitAsync(TimeSpan.FromSeconds(30), cancellationToken);
            }

            return result;
        }
    }
}
