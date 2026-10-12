using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using ResearchCruiseApp.Infrastructure.Identity;

namespace ResearchCruiseApp.IntegrationTests.Infrastructure;

internal static class TestUsers
{
    internal const string Password = "SyntheticPassword1!";

    internal static async Task<User> Create(
        TestApplication app,
        string email,
        params string[] roles
    )
    {
        await using var scope = app.Services.CreateAsyncScope();
        var users = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var user = new User
        {
            UserName = email,
            Email = email,
            FirstName = "Test",
            LastName = "Researcher",
            EmailConfirmed = true,
            Accepted = true,
        };
        Assert.True((await users.CreateAsync(user, Password)).Succeeded);
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
                Assert.True((await roleManager.CreateAsync(new IdentityRole(role))).Succeeded);
            Assert.True((await users.AddToRoleAsync(user, role)).Succeeded);
        }
        return user;
    }
}
