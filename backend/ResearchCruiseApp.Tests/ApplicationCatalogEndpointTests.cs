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

    [Theory]
    [InlineData(RoleName.Administrator, true)]
    [InlineData(RoleName.Shipowner, true)]
    [InlineData(RoleName.Guest, true)]
    [InlineData(RoleName.ShipCrew, true)]
    [InlineData(RoleName.CruiseManager, false)]
    public async Task VisibilityIsAppliedBeforePagingAndMatchesDetailAndManagerAccess(
        string role,
        bool canViewOthers
    )
    {
        await using var factory = new AuthWebApplicationFactory();
        await factory.SeedUserAsync();
        Guid ownId;
        Guid otherId;
        List<CruiseApplication> applications;
        await using (var scope = factory.Services.CreateAsyncScope())
        {
            var users = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            var roles = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            Assert.True((await roles.CreateAsync(new IdentityRole(role))).Succeeded);
            var user = (await users.FindByEmailAsync(AuthWebApplicationFactory.UserEmail))!;
            Assert.True((await users.AddToRoleAsync(user, role)).Succeeded);
            var other = new User
            {
                UserName = "other@example.com",
                Email = "other@example.com",
                FirstName = "Other",
                LastName = "Manager",
            };
            Assert.True((await users.CreateAsync(other)).Succeeded);
            ownId = Guid.Parse(user.Id);
            otherId = Guid.Parse(other.Id);
            applications =
            [
                CreateApplication(otherId, 1000, CruiseApplicationStatus.Draft),
                CreateApplication(otherId, 30),
                CreateApplication(ownId, 20),
                CreateApplication(otherId, 10, CruiseApplicationStatus.Draft),
            ];
            // A deputy must retain access to their own draft even when someone else manages it.
            applications[^1].FormA!.DeputyManagerId = ownId;
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            db.CruiseApplications.AddRange(applications);
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
        var first = await client.GetFromJsonAsync<ApplicationsPageResponse>(
            "/v2/applications?pageSize=2",
            JsonOptions
        );
        Assert.Equal(2, first!.Items.Count);
        var visibleIds = first.Items.Select(item => item.Id).ToList();
        if (canViewOthers)
        {
            Assert.NotNull(first.NextCursor);
            var last = await client.GetFromJsonAsync<ApplicationsPageResponse>(
                $"/v2/applications?pageSize=2&cursor={Uri.EscapeDataString(first.NextCursor)}",
                JsonOptions
            );
            visibleIds.Add(Assert.Single(last!.Items).Id);
            Assert.Null(last.NextCursor);
        }
        else
        {
            Assert.Null(first.NextCursor);
        }
        Assert.Equal(canViewOthers ? 3 : 2, visibleIds.Distinct().Count());
        Assert.Contains(applications[2].Id, visibleIds);
        Assert.Contains(applications[3].Id, visibleIds);
        Assert.DoesNotContain(applications[0].Id, visibleIds);
        Assert.Equal(canViewOthers, visibleIds.Contains(applications[1].Id));
        foreach (var application in applications)
        {
            using var detail = await client.GetAsync($"/v2/applications/{application.Id}");
            Assert.Equal(visibleIds.Contains(application.Id), detail.IsSuccessStatusCode);
        }
        var managers = await client.GetFromJsonAsync<List<ApplicationPersonResponse>>(
            "/v2/applications/managers"
        );
        Assert.Equal(2, managers!.Count);
        Assert.Contains(managers, manager => manager.Id == ownId);
        Assert.Contains(managers, manager => manager.Id == otherId);

        // With the deputy draft removed, a restricted user must not see the other manager.
        await using (var scope = factory.Services.CreateAsyncScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            db.CruiseApplications.Remove(applications[3]);
            await db.SaveChangesAsync();
        }
        managers = await client.GetFromJsonAsync<List<ApplicationPersonResponse>>(
            "/v2/applications/managers"
        );
        Assert.Equal(canViewOthers ? 2 : 1, managers!.Count);
    }

    private static CruiseApplication CreateApplication(
        Guid managerId,
        int number,
        CruiseApplicationStatus status = CruiseApplicationStatus.Accepted
    ) =>
        new()
        {
            Number = number,
            Date = new DateOnly(2026, 5, 16),
            Status = status,
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
