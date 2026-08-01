using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Persistence.Initialization.InitialData;

namespace ResearchCruiseApp.Infrastructure.Persistence.Initialization;

internal class ApplicationDbContextInitializer(
    ApplicationDbContext applicationDbContext,
    RoleManager<IdentityRole> roleManager,
    IdentityService identityService,
    RandomGenerator randomGenerator,
    IConfiguration configuration,
    ILogger<ApplicationDbContextInitializer> logger
)
{
    public async Task Initialize()
    {
        await Migrate();

        if (configuration.GetValue<bool>("Database:SeedAutomatically"))
        {
            await SeedRoleData();
            await SeedUsersData();
            await SeedUgUnits();
            await SeedResearchAreas();
            await SeedShipEquipments();
        }
    }

    private Task Migrate()
    {
        return applicationDbContext.Database.MigrateAsync();
    }

    private async Task SeedUsersData()
    {
        var users = new InitialUsersData(configuration).Users;

        if (users is null)
            return;

        foreach (var user in users)
        {
            var password = randomGenerator.CreateSecurePassword();
            var result = await identityService.EnsureSeedUserWithRole(
                user.Email,
                user.FirstName,
                user.LastName,
                password,
                user.Role!
            );

            if (!result.IsSuccess)
            {
                logger.LogWarning(
                    "Seed user was not created: {Email} - {Error}",
                    user.Email,
                    result.Error?.Message
                );
                continue;
            }

            if (
                result.Data == SeedUserStatus.Created
                && configuration.GetValue<bool>("Database:LogUserPasswordsWhenSeeding")
            )
                logger.LogWarning("Seed User Created: {Email} - {Password}", user.Email, password);
        }
    }

    private async Task SeedRoleData()
    {
        var roleNames = SeedAdministrationData.RoleNames;

        foreach (var roleName in roleNames)
        {
            if (!await roleManager.RoleExistsAsync(roleName))
                await roleManager.CreateAsync(new IdentityRole(roleName));
        }
    }

    private async Task SeedUgUnits()
    {
        var existingNames = (
            await applicationDbContext.UgUnits.Select(ugUnit => ugUnit.Name).ToListAsync()
        ).ToHashSet();

        var newUgUnits = SeedUgUnitData
            .UgUnitsNames.Where(name => !existingNames.Contains(name))
            .Select(name => new UgUnit { Name = name, IsActive = true })
            .ToList();

        if (newUgUnits.Count == 0)
            return;

        await applicationDbContext.UgUnits.AddRangeAsync(newUgUnits);
        await applicationDbContext.SaveChangesAsync();
    }

    private async Task SeedResearchAreas()
    {
        var existingNames = (
            await applicationDbContext
                .ResearchAreas.Select(researchArea => researchArea.Name)
                .ToListAsync()
        ).ToHashSet();

        var newResearchAreas = SeedResearchAreaData
            .ResearchAreaNames.Where(name => !existingNames.Contains(name))
            .Select(name => new ResearchArea { Name = name, IsActive = true })
            .ToList();

        if (newResearchAreas.Count == 0)
            return;

        await applicationDbContext.ResearchAreas.AddRangeAsync(newResearchAreas);
        await applicationDbContext.SaveChangesAsync();
    }

    private async Task SeedShipEquipments()
    {
        var existingNames = (
            await applicationDbContext
                .ShipEquipments.Select(shipEquipment => shipEquipment.Name)
                .ToListAsync()
        ).ToHashSet();

        var newShipEquipments = SeedShipEquipmentData
            .ShipEquipmentsNames.Where(name => !existingNames.Contains(name))
            .Select(name => new ShipEquipment { Name = name, IsActive = true })
            .ToList();

        if (newShipEquipments.Count == 0)
            return;

        await applicationDbContext.ShipEquipments.AddRangeAsync(newShipEquipments);
        await applicationDbContext.SaveChangesAsync();
    }
}
