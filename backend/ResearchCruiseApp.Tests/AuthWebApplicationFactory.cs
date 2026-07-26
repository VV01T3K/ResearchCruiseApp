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

/// <summary>
/// Boots the real HTTP pipeline against an in-memory SQLite database.
/// </summary>
/// <remarks>
/// The rate limiter is a singleton per factory and every test shares the loopback partition, so
/// each test class needs its own instance via <see cref="Xunit.IClassFixture{T}"/>.
/// </remarks>
internal sealed class AuthWebApplicationFactory : WebApplicationFactory<Program>
{
    public const string UserEmail = "session@example.com";
    public const string UserPassword = "SessionPassword1!";

    // Held open for the lifetime of the factory: an in-memory SQLite database is dropped as soon as
    // its last connection closes.
    private readonly SqliteConnection _connection = new("DataSource=:memory:");

    public AuthWebApplicationFactory()
    {
        // The refresh cookie is Secure, and CookieContainer (unlike browsers and curl) has no
        // localhost exemption, so it would silently drop the cookie on an http base address.
        // TestServer does no real TLS; this only sets the request scheme.
        ClientOptions.BaseAddress = new Uri("https://localhost");
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        // WebApplicationInitializationExtensions.InitializeDatabase early-returns for "Testing", so
        // nothing reaches for SQL Server or seeds.
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
                    // Deliberately left unset so the endpoints exercise the fail-closed default:
                    // ["Auth:RefreshCookieSecure"]
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

    /// <summary>
    /// Creates a client that talks to the https base address and keeps no cookie jar of its own.
    /// </summary>
    /// <remarks>
    /// Two defaults make this necessary. <c>CreateClient</c> installs its own
    /// <see cref="CookieContainerHandler"/>, which would keep supplying a valid rotated cookie to
    /// tests that mean to control the Cookie header themselves. And the
    /// <c>CreateDefaultClient(handlers)</c> overload ignores <see cref="ClientOptions"/> and
    /// hardcodes an http base address, on which <see cref="System.Net.CookieContainer"/> silently
    /// drops the Secure refresh cookie.
    /// </remarks>
    public HttpClient CreateSessionClient(params DelegatingHandler[] handlers) =>
        CreateDefaultClient(ClientOptions.BaseAddress, handlers);

    /// <summary>
    /// Creates a confirmed, accepted user that <see cref="IdentityService.CanUserLogin"/> accepts.
    /// </summary>
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
        // AddDbContext registers the options plus (since EF 9) an IDbContextOptionsConfiguration
        // that still points at SQL Server. Leaving either behind makes the replacement a no-op.
        var doomed = services
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

        foreach (var descriptor in doomed)
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
