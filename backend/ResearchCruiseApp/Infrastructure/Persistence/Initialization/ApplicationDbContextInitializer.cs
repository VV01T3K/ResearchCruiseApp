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
    private const string SeedLockResource = "ResearchCruiseApp:DatabaseSeed";

    public async Task Initialize()
    {
        await Migrate();

        var seedLockAcquired = await AcquireSeedLock();
        try
        {
            await SeedRoleData();
            await SeedReferenceData();

            if (
                configuration.GetSection("Database:SeedAccountsAutomatically").Value?.ToBool()
                ?? false
            )
            {
                await SeedUsersData();
            }
        }
        finally
        {
            if (seedLockAcquired)
                await ReleaseSeedLock();
        }
    }

    private Task Migrate()
    {
        return applicationDbContext.Database.MigrateAsync();
    }

    private async Task<bool> AcquireSeedLock()
    {
        if (!applicationDbContext.Database.IsSqlServer())
            return false;

        await applicationDbContext.Database.OpenConnectionAsync();
        try
        {
            await applicationDbContext.Database.ExecuteSqlInterpolatedAsync(
                $"""
                DECLARE @result int;
                EXEC @result = sys.sp_getapplock
                    @Resource = {SeedLockResource},
                    @LockMode = 'Exclusive',
                    @LockOwner = 'Session',
                    @LockTimeout = 60000;
                IF @result < 0
                    THROW 51000, 'Timed out waiting for the database seed lock.', 1;
                """
            );
            return true;
        }
        catch
        {
            await applicationDbContext.Database.CloseConnectionAsync();
            throw;
        }
    }

    private async Task ReleaseSeedLock()
    {
        try
        {
            await applicationDbContext.Database.ExecuteSqlInterpolatedAsync(
                $"""
                EXEC sys.sp_releaseapplock
                    @Resource = {SeedLockResource},
                    @LockOwner = 'Session';
                """
            );
        }
        finally
        {
            await applicationDbContext.Database.CloseConnectionAsync();
        }
    }

    private async Task SeedUsersData()
    {
        var users = new InitialUsersData(configuration).Users;

        if (users is null)
            return;

        foreach (var user in users)
        {
            if (await identityService.UserWithEmailExists(user.Email!))
                continue;

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

    private async Task SeedReferenceData()
    {
        await SeedNamedEntities(
            applicationDbContext.UgUnits,
            SeedUgUnitData.UgUnitsNames,
            name => new UgUnit { Name = name, IsActive = true },
            entity => entity.Name
        );
        await SeedNamedEntities(
            applicationDbContext.ResearchAreas,
            SeedResearchAreaData.ResearchAreaNames,
            name => new ResearchArea { Name = name, IsActive = true },
            entity => entity.Name
        );
        await SeedNamedEntities(
            applicationDbContext.ShipEquipments,
            SeedShipEquipmentData.ShipEquipmentsNames,
            name => new ShipEquipment { Name = name, IsActive = true },
            entity => entity.Name
        );

        await applicationDbContext.SaveChangesAsync();
    }

    private static async Task SeedNamedEntities<TEntity>(
        DbSet<TEntity> entities,
        IEnumerable<string> seedNames,
        Func<string, TEntity> createEntity,
        System.Linq.Expressions.Expression<Func<TEntity, string>> selectName
    )
        where TEntity : class
    {
        var existingNames = (await entities.Select(selectName).ToListAsync()).ToHashSet();
        var newEntities = seedNames
            .Where(name => !existingNames.Contains(name))
            .Select(createEntity)
            .ToList();

        if (newEntities.Count > 0)
            await entities.AddRangeAsync(newEntities);
    }
}
