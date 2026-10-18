using System.Data.Common;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore.Diagnostics;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Api.Users;
using ResearchCruiseApp.Domain;
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

    private static async Task<int[]> Measure(
        RoleQueryCounter counter,
        HttpClient admin,
        HttpClient office,
        Dictionary<Guid, string[]> roles
    )
    {
        var ct = TestContext.Current.CancellationToken;
        var managers = roles
            .Where(pair => pair.Value.Contains(RoleName.CruiseManager))
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

            counter.Reset();
            var context = (
                await client.GetFromJsonAsync<FormAOptions>("/v2/applications/form-a/context", ct)
            )!;
            counts.Add(counter.Count);
            Assert.Equal(
                roles.Keys.Order(),
                context.CruiseManagers.Select(user => user.Id).Order()
            );
            Assert.Equal(managers.Order(), context.DeputyManagers.Select(user => user.Id).Order());
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
