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
        var roleNames = InitialAdministrationData.RoleNames;

        foreach (var roleName in roleNames)
        {
            if (!await roleManager.RoleExistsAsync(roleName))
                await roleManager.CreateAsync(new IdentityRole(roleName));
        }
    }

    private async Task SeedUgUnits()
    {
        if (await applicationDbContext.UgUnits.AnyAsync())
            return;

        foreach (var ugUnitName in InitialUgUnitData.UgUnitsNames)
        {
            var newUgUnit = new UgUnit { Name = ugUnitName, IsActive = true };
            await applicationDbContext.UgUnits.AddAsync(newUgUnit);
        }

        await applicationDbContext.SaveChangesAsync();
    }

    private async Task SeedResearchAreas()
    {
        if (await applicationDbContext.ResearchAreas.AnyAsync())
            return;

        foreach (var researchAreaName in InitialResearchAreaData.ResearchAreaNames)
        {
            var newResearchArea = new ResearchArea { Name = researchAreaName, IsActive = true };
            await applicationDbContext.ResearchAreas.AddAsync(newResearchArea);
        }

        await applicationDbContext.SaveChangesAsync();
    }

    private async Task SeedShipEquipments()
    {
        if (await applicationDbContext.ShipEquipments.AnyAsync())
            return;

        foreach (var shipEquipmentName in InitialShipEquipmentData.ShipEquipmentsNames)
        {
            var newShipEquipment = new ShipEquipment { Name = shipEquipmentName, IsActive = true };
            await applicationDbContext.ShipEquipments.AddAsync(newShipEquipment);
        }

        await applicationDbContext.SaveChangesAsync();
    }
}
