using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp_API.Domain.Common.Constants;
using ResearchCruiseApp_API.Domain.Entities;
using ResearchCruiseApp_API.Infrastructure.Persistence.Initialization.InitialData;
using ResearchCruiseApp_API.Infrastructure.Services.Identity;

namespace ResearchCruiseApp_API.Infrastructure.Persistence.Initialization;


internal class ApplicationDbContextInitializer(
    ApplicationDbContext applicationDbContext,
    RoleManager<IdentityRole> roleManager,
    UserManager<User> userManager)
{
    public async Task Initialize()
    {
        await Migrate();
        await SeedAdministrationData();
        await SeedUgUnits();
    }


    private async Task Migrate()
    {
        var pendingMigrations = await applicationDbContext.Database.GetPendingMigrationsAsync();
        
        if (pendingMigrations.Any())
            await applicationDbContext.Database.MigrateAsync();
    }

    private async Task SeedAdministrationData()
    {
        var roleNames = InitialAdministrationData.RoleNames;
    
        foreach (var roleName in roleNames)
        {
            if (!await roleManager.RoleExistsAsync(roleName))
                await roleManager.CreateAsync(new IdentityRole(roleName));
        }

        var admin = await userManager.FindByEmailAsync(InitialAdministrationData.AdminEmail);
        if (admin is null)
        {
            var adminUser = new User
            {
                UserName = InitialAdministrationData.AdminEmail,
                Email = InitialAdministrationData.AdminEmail,
                FirstName = InitialAdministrationData.AdminFirstName,
                LastName = InitialAdministrationData.AdminLastName,
                EmailConfirmed = true,
                Accepted = true
            };
            await userManager.CreateAsync(adminUser, InitialAdministrationData.AdminPassword);
            await userManager.AddToRoleAsync(adminUser, RoleName.Administrator);
        }
    }

    private async Task SeedUgUnits()
    {
        if (await applicationDbContext.UgUnits.AnyAsync())
            return;
        
        foreach (var ugUnitName in InitialUgUnitData.UgUnitsNames)
        {
            var newUgUnit = new UgUnit
            {
                Name = ugUnitName,
                IsActive = true
            };
            await applicationDbContext.UgUnits.AddAsync(newUgUnit);
        }
        
        await applicationDbContext.SaveChangesAsync();
    }
}