using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Identity;
using ResearchCruiseApp.Infrastructure.Security;

namespace ResearchCruiseApp.Infrastructure.Persistence.Initialization.DevData;

/// <summary>
/// Generates or removes throwaway CruiseApplication rows (plus the handful of
/// Cruises/Users needed to satisfy their FKs) for local manual testing of the
/// applications list. Intended to be invoked via the "seed-applications" CLI
/// command in Program.cs, which already restricts this to Development.
/// </summary>
internal static class CruiseApplicationsTestDataSeeder
{
    // Prefixed onto every value we can freely tag (Note, Cruise.Number/Title) so
    // generated rows are unmistakable and cheap to find again for removal.
    private const string SeedTag = "[SEED-DATA]";
    private const string SeedEmailDomain = "seed.researchcruiseapp.test";
    private const int SeedManagersCount = 3;
    private const int SeedCruisesCount = 4;

    private static readonly string[] FirstNames =
    [
        "Anna",
        "Piotr",
        "Katarzyna",
        "Marek",
        "Ewa",
        "Tomasz",
        "Magdalena",
        "Jan",
    ];
    private static readonly string[] LastNames =
    [
        "Nowak",
        "Kowalski",
        "Wiśniewska",
        "Wójcik",
        "Kowalczyk",
        "Kamiński",
        "Lewandowska",
        "Zieliński",
    ];

    public static async Task<int> Seed(IServiceProvider rootServices, int count)
    {
        using var scope = rootServices.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var randomGenerator = scope.ServiceProvider.GetRequiredService<RandomGenerator>();

        await dbContext.Database.MigrateAsync();

        var random = new Random();
        var managers = await GetOrCreateSeedManagers(
            userManager,
            roleManager,
            randomGenerator,
            random
        );
        var cruises = await GetOrCreateSeedCruises(dbContext, managers, random);

        var statuses = Enum.GetValues<CruiseApplicationStatus>();

        var newApplications = new List<CruiseApplication>();
        for (var i = 0; i < count; i++)
        {
            var manager = managers[random.Next(managers.Count)];
            var deputy = managers[random.Next(managers.Count)];
            var cruise = random.NextDouble() < 0.7 ? cruises[random.Next(cruises.Count)] : null;

            newApplications.Add(
                new CruiseApplication
                {
                    Date = DateOnly.FromDateTime(PastDate(random, 3)),
                    Status = statuses[random.Next(statuses.Length)],
                    EffectsPoints = random.Next(0, 21),
                    Note = $"{SeedTag} note {i}",
                    Cruise = cruise,
                    FormA = new FormA
                    {
                        CruiseManagerId = Guid.Parse(manager.Id),
                        DeputyManagerId = Guid.Parse(deputy.Id),
                        Year = PastDate(random, 3).Year.ToString(),
                        CruiseHours = random.Next(24, 721).ToString(),
                        PeriodNotes = $"{SeedTag} period notes {i}",
                        DifferentUsage = $"{SeedTag} different usage {i}",
                        CruiseGoalDescription = $"{SeedTag} goal description {i}",
                        SupervisorEmail = $"supervisor-{i}@{SeedEmailDomain}",
                    },
                }
            );
        }

        dbContext.CruiseApplications.AddRange(newApplications);
        await dbContext.SaveChangesAsync();

        return newApplications.Count;
    }

    public static async Task<(int applications, int cruises, int users)> Remove(
        IServiceProvider rootServices
    )
    {
        using var scope = rootServices.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

        var seedApplications = await dbContext
            .CruiseApplications.Include(cruiseApplication => cruiseApplication.FormA)
            .Where(cruiseApplication =>
                cruiseApplication.Note != null && cruiseApplication.Note.StartsWith(SeedTag)
            )
            .ToListAsync();
        var seedFormAs = seedApplications
            .Select(cruiseApplication => cruiseApplication.FormA)
            .Where(formA => formA is not null)
            .Select(formA => formA!)
            .ToList();

        dbContext.CruiseApplications.RemoveRange(seedApplications);
        dbContext.FormsA.RemoveRange(seedFormAs);
        await dbContext.SaveChangesAsync();

        var seedCruises = await dbContext
            .Cruises.Where(cruise => cruise.Number.StartsWith(SeedTag))
            .ToListAsync();
        dbContext.Cruises.RemoveRange(seedCruises);
        await dbContext.SaveChangesAsync();

        var seedUsers = await userManager
            .Users.Where(user => user.Email != null && user.Email.EndsWith(SeedEmailDomain))
            .ToListAsync();
        foreach (var user in seedUsers)
            await userManager.DeleteAsync(user);

        return (seedApplications.Count, seedCruises.Count, seedUsers.Count);
    }

    private static async Task<List<User>> GetOrCreateSeedManagers(
        UserManager<User> userManager,
        RoleManager<IdentityRole> roleManager,
        RandomGenerator randomGenerator,
        Random random
    )
    {
        if (!await roleManager.RoleExistsAsync(RoleName.CruiseManager))
            await roleManager.CreateAsync(new IdentityRole(RoleName.CruiseManager));

        var managers = new List<User>();

        for (var i = 1; i <= SeedManagersCount; i++)
        {
            var email = $"seed-manager-{i}@{SeedEmailDomain}";
            var existing = await userManager.FindByEmailAsync(email);
            if (existing is not null)
            {
                managers.Add(existing);
                continue;
            }

            var user = new User
            {
                UserName = email,
                Email = email,
                FirstName = FirstNames[random.Next(FirstNames.Length)],
                LastName = LastNames[random.Next(LastNames.Length)],
                Accepted = true,
                EmailConfirmed = true,
            };

            var createResult = await userManager.CreateAsync(
                user,
                randomGenerator.CreateSecurePassword()
            );
            if (!createResult.Succeeded)
                throw new InvalidOperationException(
                    $"Failed to create seed manager {email}: "
                        + string.Join(", ", createResult.Errors.Select(error => error.Description))
                );

            await userManager.AddToRoleAsync(user, RoleName.CruiseManager);
            managers.Add(user);
        }

        return managers;
    }

    private static async Task<List<Cruise>> GetOrCreateSeedCruises(
        ApplicationDbContext dbContext,
        List<User> managers,
        Random random
    )
    {
        var existing = await dbContext
            .Cruises.Where(cruise => cruise.Number.StartsWith(SeedTag))
            .ToListAsync();
        if (existing.Count > 0)
            return existing;

        var statuses = Enum.GetValues<CruiseStatus>();
        var cruises = new List<Cruise>();

        for (var i = 1; i <= SeedCruisesCount; i++)
        {
            var start = PastDate(random, 2);
            var end = start.AddDays(random.Next(3, 22));

            cruises.Add(
                new Cruise
                {
                    Number = $"{SeedTag}-{i}",
                    Title = $"{SeedTag} cruise {i}",
                    MainCruiseManagerId = Guid.Parse(managers[random.Next(managers.Count)].Id),
                    MainDeputyManagerId = Guid.Parse(managers[random.Next(managers.Count)].Id),
                    StartDate = start.ToString("yyyy-MM-ddTHH:mm:ss.fffZ"),
                    EndDate = end.ToString("yyyy-MM-ddTHH:mm:ss.fffZ"),
                    Status = statuses[random.Next(statuses.Length)],
                    CruiseApplications = [],
                }
            );
        }

        dbContext.Cruises.AddRange(cruises);
        await dbContext.SaveChangesAsync();
        return cruises;
    }

    private static DateTime PastDate(Random random, int yearsBack) =>
        DateTime.Today.AddDays(-random.Next(0, yearsBack * 365));
}
