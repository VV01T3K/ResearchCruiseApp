using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging.Abstractions;
using ResearchCruiseApp.Infrastructure.Email;
using ResearchCruiseApp.Infrastructure.Identity;
using ResearchCruiseApp.Infrastructure.Localization;
using ResearchCruiseApp.Infrastructure.Persistence;
using Xunit;

namespace ResearchCruiseApp.Tests;

public sealed class SeedUserWorkflowTests
{
    [Fact]
    public async Task RepairsAnIncompleteSeedUserOnlyOnce()
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseInMemoryDatabase(Guid.NewGuid().ToString())
        );
        services
            .AddIdentityCore<User>()
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>();

        await using var provider = services.BuildServiceProvider();
        await using var scope = provider.CreateAsyncScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var configuration = new ConfigurationBuilder().Build();
        var emailSender = new EmailSender(
            configuration,
            new TemplateFileReader(),
            new GlobalizationService(),
            NullLogger<EmailSender>.Instance
        );
        const string email = "seed@example.com";
        const string role = "Administrator";

        await roleManager.CreateAsync(new IdentityRole(role));
        var incompleteUser = new User
        {
            UserName = email,
            Email = email,
            FirstName = "Seed",
            LastName = "User",
        };
        await userManager.CreateAsync(incompleteUser);

        var identityService = new IdentityService(
            userManager,
            roleManager,
            emailSender,
            null!,
            null!,
            configuration,
            dbContext,
            NullLogger<IdentityService>.Instance
        );

        var repaired = await identityService.EnsureSeedUserWithRole(
            email,
            "Seed",
            "User",
            "ValidPassword1!",
            role
        );
        var repeated = await identityService.EnsureSeedUserWithRole(
            email,
            "Seed",
            "User",
            "AnotherPassword1!",
            role
        );
        var repairedUser = await userManager.FindByEmailAsync(email);

        Assert.True(repaired.IsSuccess);
        Assert.Equal(SeedUserStatus.Created, repaired.Data);
        Assert.True(repeated.IsSuccess);
        Assert.Equal(SeedUserStatus.AlreadyComplete, repeated.Data);
        Assert.NotNull(repairedUser);
        Assert.NotEqual(incompleteUser.Id, repairedUser.Id);
        Assert.True(await userManager.IsInRoleAsync(repairedUser, role));
        Assert.Single(await userManager.Users.ToListAsync());
    }
}
