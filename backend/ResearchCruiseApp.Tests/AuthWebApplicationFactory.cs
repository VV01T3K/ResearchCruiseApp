using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ResearchCruiseApp.Infrastructure.Identity;
using ResearchCruiseApp.Infrastructure.Persistence;

namespace ResearchCruiseApp.Tests;

internal sealed class AuthWebApplicationFactory : WebApplicationFactory<Program>
{
    public const string UserEmail = "session@example.com";
    public const string UserPassword = "SessionPassword1!";

    private readonly SqliteConnection _connection = new("DataSource=:memory:");

    public AuthWebApplicationFactory()
    {
        ClientOptions.BaseAddress = new Uri("https://localhost");
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");

        builder.ConfigureAppConfiguration(configuration =>
            configuration.AddInMemoryCollection(
                new Dictionary<string, string?>
                {
                    ["JWT:ValidIssuer"] = "https://tests.local/",
                    ["JWT:ValidAudience"] = "https://tests.local/",
                    ["JWT:Secret"] = "TestSecretThatIsAtLeastTwoHundredFiftySixBitsLong!!",
                    ["JWT:AccessTokenLifetimeSeconds"] = "900",
                    ["JWT:RefreshTokenLifetimeSeconds"] = "7200",
                }
            )
        );

        builder.ConfigureServices(services =>
        {
            _connection.Open();

            RemoveDbContextRegistrations(services);
            services.AddDbContext<ApplicationDbContext>(options => options.UseSqlite(_connection));
        });
    }

    public HttpClient CreateSessionClient(params DelegatingHandler[] handlers) =>
        CreateDefaultClient(ClientOptions.BaseAddress, handlers);

    public async Task SeedUserAsync()
    {
        await using var scope = Services.CreateAsyncScope();

        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        await dbContext.Database.EnsureCreatedAsync();

        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        if (await userManager.FindByEmailAsync(UserEmail) is not null)
            return;

        var user = new User
        {
            UserName = UserEmail,
            Email = UserEmail,
            EmailConfirmed = true,
            Accepted = true,
            FirstName = "Session",
            LastName = "User",
        };

        var result = await userManager.CreateAsync(user, UserPassword);
        if (!result.Succeeded)
        {
            throw new InvalidOperationException(
                "Could not seed the test user: "
                    + string.Join(", ", result.Errors.Select(error => error.Description))
            );
        }
    }

    public async Task<string?> GetStoredRefreshTokenHashAsync()
    {
        await using var scope = Services.CreateAsyncScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

        return (await userManager.FindByEmailAsync(UserEmail))?.RefreshToken;
    }

    private static void RemoveDbContextRegistrations(IServiceCollection services)
    {
        var registrations = services
            .Where(descriptor =>
                descriptor.ServiceType == typeof(DbContextOptions<ApplicationDbContext>)
                || descriptor.ServiceType == typeof(DbContextOptions)
                || descriptor.ServiceType == typeof(ApplicationDbContext)
                || (
                    descriptor.ServiceType.IsGenericType
                    && descriptor
                        .ServiceType.GetGenericTypeDefinition()
                        .Name.StartsWith("IDbContextOptionsConfiguration", StringComparison.Ordinal)
                    && descriptor.ServiceType.GenericTypeArguments.Contains(
                        typeof(ApplicationDbContext)
                    )
                )
            )
            .ToList();

        foreach (var descriptor in registrations)
        {
            services.Remove(descriptor);
        }
    }

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);
        if (disposing)
            _connection.Dispose();
    }
}
