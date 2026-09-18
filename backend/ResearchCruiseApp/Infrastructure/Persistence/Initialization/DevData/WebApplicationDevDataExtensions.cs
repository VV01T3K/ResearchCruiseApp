namespace ResearchCruiseApp.Infrastructure.Persistence.Initialization.DevData;

internal static class WebApplicationDevDataExtensions
{
    /// <summary>
    /// Handles "dotnet run -- seed-applications [count|remove]". Returns true if the
    /// process should exit immediately afterward instead of starting the web app.
    /// </summary>
    public static async Task<bool> RunSeedApplicationsCommand(
        this WebApplication app,
        string[] args
    )
    {
        if (
            args.Length == 0
            || !args[0].Equals("seed-applications", StringComparison.OrdinalIgnoreCase)
        )
            return false;

        if (!app.Environment.IsDevelopment())
        {
            Console.Error.WriteLine(
                "seed-applications refuses to run outside the Development environment."
            );
            Environment.ExitCode = 1;
            return true;
        }

        if (args.Length > 1 && args[1].Equals("remove", StringComparison.OrdinalIgnoreCase))
        {
            var (applications, cruises, users) = await CruiseApplicationsTestDataSeeder.Remove(
                app.Services
            );
            Console.WriteLine(
                $"Removed {applications} seeded CruiseApplication(s), {cruises} seeded Cruise(s), {users} seeded User(s)."
            );
        }
        else
        {
            var count =
                args.Length > 1 && int.TryParse(args[1], out var parsedCount) ? parsedCount : 200;
            var seeded = await CruiseApplicationsTestDataSeeder.Seed(app.Services, count);
            Console.WriteLine($"Seeded {seeded} CruiseApplication(s) tagged as test data.");
        }

        return true;
    }
}
