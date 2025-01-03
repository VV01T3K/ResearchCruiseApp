using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Application.Common.Extensions;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Persistence.Initialization.InitialData;

namespace ResearchCruiseApp.Infrastructure.Persistence.Initialization;

internal class ApplicationDbContextInitializer(
    ApplicationDbContext applicationDbContext,
    RoleManager<IdentityRole> roleManager,
    IIdentityService identityService,
    IRandomGenerator randomGenerator,
    IConfiguration configuration,
    ILogger<ApplicationDbContextInitializer> logger
)
{
    public async Task Initialize()
    {
        await Migrate();

        if (configuration.GetSection("Database:SeedAutomatically").Value?.ToBool() ?? false)
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
            await identityService.AddUserWithRole(user, password, user.Role!);
            if (
                configuration.GetSection("Database:LogUserPasswordsWhenSeeding").Value?.ToBool()
                ?? false
            )
            {
                logger.LogWarning("Seed User Created: {email} - {password}", user.Email, password);
            }
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
