using Microsoft.EntityFrameworkCore;
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

    // BE-STARTUP-002: seeding repairs missing reference rows without overwriting local choices.
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
