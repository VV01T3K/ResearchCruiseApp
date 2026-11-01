using System.Data.Common;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.EntityFrameworkCore.Diagnostics;
using ResearchCruiseApp.Api.Users;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Auth;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class UserRoleQueryTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    [Fact]
    public async Task Lists_WhenUsersGrow_LoadRolesInBoundedQueries()
    {
        var counter = new RoleQueryCounter();
        await using var app = new TestApplication(fixture.ConnectionString, interceptor: counter);
        var roles = new Dictionary<Guid, string[]>();
        async Task Add(string email, params string[] userRoles) =>
            roles.Add(Guid.Parse((await TestUsers.Create(app, email, userRoles)).Id), userRoles);
        await Add("admin@example.invalid", RoleName.Administrator);
        await Add("office@example.invalid", RoleName.Shipowner);
        await Add("combined@example.invalid", RoleName.Administrator, RoleName.CruiseManager);
        await Add("roleless@example.invalid");
        using var admin = await TestApplications.Login(app, "admin@example.invalid");
        using var office = await TestApplications.Login(app, "office@example.invalid");

        var small = await Measure(counter, admin, office, roles);
        for (var i = 0; i < 5; i++)
            await Add($"manager{i}@example.invalid", RoleName.CruiseManager);
        var large = await Measure(counter, admin, office, roles);

        Assert.Equal(small, large);
    }

    [Fact]
    public async Task ApplicationLists_WhenApplicationsGrow_LoadRolesInBoundedQueries()
    {
        var ct = TestContext.Current.CancellationToken;
        var counter = new RoleQueryCounter();
        await using var app = new TestApplication(fixture.ConnectionString, interceptor: counter);
        await TestUsers.Create(app, "admin@example.invalid", RoleName.Administrator);
        using var admin = await TestApplications.Login(app, "admin@example.invalid");

        async Task<int[]> Measure(int expected)
        {
            counter.Reset();
            var page = await admin.GetFromJsonAsync<JsonElement>("/v2/applications", ct);
            var pageCount = counter.Count;
            var items = page.GetProperty("items").EnumerateArray().ToArray();
            Assert.Equal(expected, items.Length);
            foreach (var item in items)
                Assert.EndsWith(
                    "@example.invalid",
                    item.GetProperty("mainManager").GetProperty("email").GetString()
                );

            counter.Reset();
            var candidates = await admin.GetFromJsonAsync<JsonElement[]>(
                "/v2/applications/for-cruise-planning",
                ct
            );
            var candidatesCount = counter.Count;
            Assert.Equal(expected, candidates!.Length);
            foreach (var candidate in candidates)
                Assert.NotEmpty(candidate.GetProperty("cruiseManagerLastName").GetString()!);
            return [pageCount, candidatesCount];
        }

        await TestApplications.Create(
            app,
            CruiseApplicationStatus.Accepted,
            "owner0@example.invalid"
        );
        var small = await Measure(1);
        for (var i = 1; i < 4; i++)
            await TestApplications.Create(
                app,
                CruiseApplicationStatus.Accepted,
                $"owner{i}@example.invalid"
            );
        var large = await Measure(4);

        Assert.Equal(small, large);
    }

    private static async Task<int[]> Measure(
        RoleQueryCounter counter,
        HttpClient admin,
        HttpClient office,
        Dictionary<Guid, string[]> roles
    )
    {
        var ct = TestContext.Current.CancellationToken;
        var managers = roles
            .Where(pair =>
                pair.Value.Contains(RoleName.CruiseManager)
                && !pair.Value.Contains(RoleName.Administrator)
            )
            .Select(pair => pair.Key);
        var counts = new List<int>();
        foreach (var (client, visible) in new[] { (admin, roles.Keys), (office, managers) })
        {
            counter.Reset();
            var users = (await client.GetFromJsonAsync<List<UserResponse>>("/v2/users", ct))!;
            counts.Add(counter.Count);
            Assert.Equal(visible.Order(), users.Select(user => user.Id).Order());
            foreach (var user in users)
                Assert.Equal(roles[user.Id].Order(), user.Roles.Order());
        }
        return [.. counts];
    }

    private sealed class RoleQueryCounter : DbCommandInterceptor
    {
        private int _count;

        internal int Count => Volatile.Read(ref _count);

        internal void Reset() => Interlocked.Exchange(ref _count, 0);

        public override ValueTask<InterceptionResult<DbDataReader>> ReaderExecutingAsync(
            DbCommand command,
            CommandEventData eventData,
            InterceptionResult<DbDataReader> result,
            CancellationToken cancellationToken = default
        )
        {
            if (command.CommandText.Contains("AspNetUserRoles"))
                Interlocked.Increment(ref _count);
            return base.ReaderExecutingAsync(command, eventData, result, cancellationToken);
        }
    }
}
