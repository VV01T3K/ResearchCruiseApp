using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging.Abstractions;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Email;
using ResearchCruiseApp.Infrastructure.Identity;
using ResearchCruiseApp.Infrastructure.Localization;
using ResearchCruiseApp.Infrastructure.Persistence;
using ResearchCruiseApp.Infrastructure.Persistence.Initialization;
using ResearchCruiseApp.Infrastructure.Persistence.Initialization.InitialData;
using ResearchCruiseApp.Infrastructure.Security;
using Xunit;

namespace ResearchCruiseApp.Tests;

public sealed class SeedUserWorkflowTests
{
    [Fact]
    public async Task RepairsAnIncompleteSeedUserOnlyOnce()
    {
        var services = new ServiceCollection();
        await using var connection = new SqliteConnection("DataSource=:memory:");
        await connection.OpenAsync();
        services.AddLogging();
        services.AddDbContext<ApplicationDbContext>(options => options.UseSqlite(connection));
        services
            .AddIdentityCore<User>()
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>();

        await using var provider = services.BuildServiceProvider();
        await using var scope = provider.CreateAsyncScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        await dbContext.Database.EnsureCreatedAsync();
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(
                new Dictionary<string, string?>
                {
                    ["Database:SeedAccountsAutomatically"] = "true",
                    ["Users:0:Email"] = "seed@example.com",
                    ["Users:0:FirstName"] = "Seed",
                    ["Users:0:LastName"] = "User",
                    ["Users:0:Role"] = "Administrator",
                    ["SmtpSettings:UseFakeSmtp"] = "true",
                }
            )
            .Build();
        var emailSender = new EmailSender(
            configuration,
            new TemplateFileReader(AppContext.BaseDirectory),
            new GlobalizationService(),
            new EmailOutbox(dbContext, new EphemeralDataProtectionProvider(), TimeProvider.System)
        );
        const string email = "seed@example.com";
        const string role = "Administrator";

        await roleManager.CreateAsync(new IdentityRole(role));
        var incompleteUser = new User
        {
            UserName = email,
            Email = email,
            FirstName = "Seed",
            LastName = "User",
        };
        await userManager.CreateAsync(incompleteUser);

        var identityService = new IdentityService(
            userManager,
            roleManager,
            emailSender,
            null!,
            null!,
            configuration,
            dbContext,
            NullLogger<IdentityService>.Instance
        );

        var initializer = new ApplicationDbContextInitializer(
            dbContext,
            roleManager,
            identityService,
            new RandomGenerator(),
            configuration,
            NullLogger<ApplicationDbContextInitializer>.Instance
        );
        await initializer.Seed();
        var firstUser = await userManager.FindByEmailAsync(email);
        Assert.NotNull(firstUser);
        var firstPasswordHash = firstUser.PasswordHash;
        await initializer.Seed();
        var repairedUser = await userManager.FindByEmailAsync(email);

        Assert.NotNull(repairedUser);
        Assert.NotEqual(incompleteUser.Id, repairedUser.Id);
        Assert.Equal(firstUser.Id, repairedUser.Id);
        Assert.Equal(firstPasswordHash, repairedUser.PasswordHash);
        Assert.True(await userManager.IsInRoleAsync(repairedUser, role));
        Assert.Single(await userManager.Users.ToListAsync());
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public async Task FillsPartialReferenceDataWithoutChangingExistingRows(bool seedAccounts)
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseInMemoryDatabase(Guid.NewGuid().ToString())
        );
        services
            .AddIdentityCore<User>()
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>();
        await using var provider = services.BuildServiceProvider();
        await using var scope = provider.CreateAsyncScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
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
        var customUnit = new UgUnit { Name = "Custom unit", IsActive = true };
        dbContext.AddRange(unit, area, equipment, customUnit);
        await dbContext.SaveChangesAsync();
        var settings = new Dictionary<string, string?>
        {
            ["Database:SeedAccountsAutomatically"] = seedAccounts.ToString(),
        };
        if (!seedAccounts)
        {
            settings["Users:0:Email"] = "ignored@example.com";
            settings["Users:0:Role"] = "Administrator";
        }
        var configuration = new ConfigurationBuilder().AddInMemoryCollection(settings).Build();
        var initializer = new ApplicationDbContextInitializer(
            dbContext,
            roleManager,
            null!,
            new RandomGenerator(),
            configuration,
            NullLogger<ApplicationDbContextInitializer>.Instance
        );

        await initializer.Seed();
        await initializer.Seed();
        dbContext.ChangeTracker.Clear();

        Assert.Equal(
            SeedUgUnitData.UgUnitsNames.Distinct().Count() + 1,
            await dbContext.UgUnits.CountAsync()
        );
        Assert.Equal(
            SeedResearchAreaData.ResearchAreaNames.Distinct().Count(),
            await dbContext.ResearchAreas.CountAsync()
        );
        Assert.Equal(
            SeedShipEquipmentData.ShipEquipmentsNames.Distinct().Count(),
            await dbContext.ShipEquipments.CountAsync()
        );
        Assert.Equal(SeedAdministrationData.RoleNames.Length, await dbContext.Roles.CountAsync());
        Assert.False((await dbContext.UgUnits.SingleAsync(row => row.Id == unit.Id)).IsActive);
        Assert.False(
            (await dbContext.ResearchAreas.SingleAsync(row => row.Id == area.Id)).IsActive
        );
        Assert.False(
            (await dbContext.ShipEquipments.SingleAsync(row => row.Id == equipment.Id)).IsActive
        );
        Assert.True(await dbContext.UgUnits.AnyAsync(row => row.Id == customUnit.Id));
        Assert.Empty(await dbContext.Users.ToListAsync());
    }
}
