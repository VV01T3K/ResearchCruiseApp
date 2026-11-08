using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Persistence.Initialization.InitialData;

namespace ResearchCruiseApp.Infrastructure.Persistence.Initialization;

internal enum SeedUserStatus
{
    AlreadyComplete,
    Created,
}

internal class ApplicationDbContextInitializer(
    ApplicationDbContext applicationDbContext,
    RoleManager<IdentityRole> roleManager,
    UserManager<User> userManager,
    EmailSender emailSender,
    RandomGenerator randomGenerator,
    IConfiguration configuration,
    ILogger<ApplicationDbContextInitializer> logger
)
{
    public async Task Initialize()
    {
        if (!configuration.GetValue<bool>("Database:ApplyMigrations"))
        {
            var pending = (
                await applicationDbContext.Database.GetPendingMigrationsAsync()
            ).ToList();
            if (pending.Count > 0)
                throw new InvalidOperationException(
                    $"The database has pending migrations: {string.Join(", ", pending)}. "
                        + "Back up the database, then start once with Database__ApplyMigrations=true "
                        + "(DATABASE_APPLY_MIGRATIONS=true in Docker Compose)."
                );
        }

        await applicationDbContext.Database.MigrateAsync();
    }

    public async Task Seed()
    {
        await SeedRoleData();
        await SeedUgUnits();
        await SeedResearchAreas();
        await SeedShipEquipments();

        if (configuration.GetValue<bool>("Database:SeedAccountsAutomatically"))
        {
            await SeedUsersData();
        }
    }

    private async Task SeedUsersData()
    {
        var users = new InitialUsersData(configuration).Users;

        if (users is null)
            return;

        foreach (var user in users)
        {
            var password = randomGenerator.CreateSecurePassword();
            var result = await EnsureSeedUserWithRole(
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

    public async Task<Result<SeedUserStatus>> EnsureSeedUserWithRole(
        string email,
        string firstName,
        string lastName,
        string password,
        string roleName
    )
    {
        var existingTransaction = applicationDbContext.Database.CurrentTransaction;
        await using var transaction = existingTransaction is null
            ? await applicationDbContext.Database.BeginTransactionAsync()
            : null;
        var savepoint = Guid.NewGuid().ToString("N");
        if (existingTransaction is not null)
            await existingTransaction.CreateSavepointAsync(savepoint);

        try
        {
            var result = await EnsureSeedUserCore(email, firstName, lastName, password, roleName);
            if (!result.IsSuccess)
            {
                if (existingTransaction is not null)
                    await existingTransaction.RollbackToSavepointAsync(savepoint);
                return result;
            }

            if (transaction is not null)
                await transaction.CommitAsync();
            else
                await existingTransaction!.ReleaseSavepointAsync(savepoint);
            return result;
        }
        catch
        {
            if (existingTransaction is not null)
                await existingTransaction.RollbackToSavepointAsync(savepoint);
            throw;
        }
    }

    private async Task<Result<SeedUserStatus>> EnsureSeedUserCore(
        string email,
        string firstName,
        string lastName,
        string password,
        string roleName
    )
    {
        var existingUser = await userManager.FindByEmailAsync(email);
        if (existingUser is not null)
        {
            if (await userManager.IsInRoleAsync(existingUser, roleName))
                return SeedUserStatus.AlreadyComplete;

            var deleteResult = await userManager.DeleteAsync(existingUser);
            if (!deleteResult.Succeeded)
                return deleteResult.ToApplicationResult().Error!;
        }

        var result = await userManager.CreateUserWithRoles(
            email,
            firstName,
            lastName,
            password,
            [roleName]
        );
        if (!result.IsSuccess)
            return result.Error!;

        try
        {
            await emailSender.SendAccountCreatedMessage(
                await userManager.CreateUserDto(result.Data!),
                roleName,
                password
            );
        }
        catch (Exception exception)
        {
            logger.LogWarning(exception, "Seed user notification could not be queued");
            throw;
        }

        return SeedUserStatus.Created;
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
            .UgUnitsNames.Where(existingNames.Add)
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
            .ResearchAreaNames.Where(existingNames.Add)
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
            .ShipEquipmentsNames.Where(existingNames.Add)
            .Select(name => new ShipEquipment { Name = name, IsActive = true })
            .ToList();

        if (newShipEquipments.Count == 0)
            return;

        await applicationDbContext.ShipEquipments.AddRangeAsync(newShipEquipments);
        await applicationDbContext.SaveChangesAsync();
    }
}
