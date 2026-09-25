using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using ResearchCruiseApp.Infrastructure.Persistence.Initialization;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Persistence;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class StartupTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    // BE-STARTUP-001: independent service providers share only the SQL database.
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

        // Repair a missing reference row, not just an already complete database.
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
}
