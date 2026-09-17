using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using ResearchCruiseApp.Api.Applications;
using ResearchCruiseApp.Api.Auth;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Identity;
using ResearchCruiseApp.Infrastructure.Persistence;
using Xunit;

namespace ResearchCruiseApp.Tests;

public sealed class ApplicationCatalogEndpointTests
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web)
    {
        Converters = { new JsonStringEnumConverter() },
    };

    [Fact]
    public async Task FiltersDistinguishSameNamedManagersAndCombineNumberWithDate()
    {
        await using var factory = new AuthWebApplicationFactory();
        await factory.SeedUserAsync();
        Guid firstManagerId;
        Guid secondManagerId;
        await using (var scope = factory.Services.CreateAsyncScope())
        {
            var users = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            var roles = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            Assert.True(
                (await roles.CreateAsync(new IdentityRole(RoleName.Administrator))).Succeeded
            );
            var first = (await users.FindByEmailAsync(AuthWebApplicationFactory.UserEmail))!;
            Assert.True((await users.AddToRoleAsync(first, RoleName.Administrator)).Succeeded);
            var second = new User
            {
                UserName = "other@example.com",
                Email = "other@example.com",
                FirstName = first.FirstName,
                LastName = first.LastName,
            };
            Assert.True((await users.CreateAsync(second)).Succeeded);
            firstManagerId = Guid.Parse(first.Id);
            secondManagerId = Guid.Parse(second.Id);
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            db.CruiseApplications.AddRange(
                CreateApplication(firstManagerId, 17),
                CreateApplication(secondManagerId, 18)
            );
            await db.SaveChangesAsync();
        }

        using var client = factory.CreateSessionClient();
        var login = await client.PostAsJsonAsync(
            "/v2/auth/login",
            new LoginRequest(
                AuthWebApplicationFactory.UserEmail,
                AuthWebApplicationFactory.UserPassword
            )
        );
        login.EnsureSuccessStatusCode();
        var token = await login.Content.ReadFromJsonAsync<TokenResponse>();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            token!.AccessToken
        );

        var managers = await client.GetFromJsonAsync<List<ApplicationPersonResponse>>(
            "/v2/applications/managers"
        );
        Assert.Equal(2, managers!.Count);
        var selected = await client.GetFromJsonAsync<ApplicationsPageResponse>(
            $"/v2/applications?cruiseManager={secondManagerId}",
            JsonOptions
        );
        Assert.Equal("18", Assert.Single(selected!.Items).Number);
        var combined = await client.GetFromJsonAsync<ApplicationsPageResponse>(
            $"/v2/applications?cruiseManager={firstManagerId}&number=17&date=2026-05-16",
            JsonOptions
        );
        Assert.Equal("17", Assert.Single(combined!.Items).Number);
        var mismatch = await client.GetFromJsonAsync<ApplicationsPageResponse>(
            "/v2/applications?number=17&date=2026-05-17",
            JsonOptions
        );
        Assert.Empty(mismatch!.Items);
    }

    private static CruiseApplication CreateApplication(Guid managerId, int number) =>
        new()
        {
            Number = number,
            Date = new DateOnly(2026, 5, 16),
            Status = CruiseApplicationStatus.Accepted,
            FormA = new FormA
            {
                CruiseManagerId = managerId,
                DeputyManagerId = managerId,
                Year = "2026",
                CruiseHours = "24",
                PeriodNotes = "",
                DifferentUsage = "",
                CruiseGoalDescription = "",
                SupervisorEmail = "supervisor@example.com",
            },
        };
}
