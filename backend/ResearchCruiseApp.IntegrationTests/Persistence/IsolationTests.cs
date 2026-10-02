using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Persistence;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class IsolationTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    // BE-ISOLATION-001: reset clears business, Identity, queue and host key state.
    [Fact]
    public async Task Reset_WhenPreviousScenarioWroteData_PreservesOnlyMigrationHistory()
    {
        var cancellationToken = TestContext.Current.CancellationToken;
        string[] history;
        await using (var app = new TestApplication(fixture.ConnectionString))
        {
            await TestUsers.Create(app, "isolation@example.invalid", "TestRole");
            await app.InDatabase(async db =>
            {
                db.UgUnits.Add(new UgUnit { Name = "Synthetic unit", IsActive = true });
                await db.SaveChangesAsync(cancellationToken);
            });
            await app.Enqueue("isolation@example.invalid", "Reset", "Synthetic message");
            await using var db = fixture.CreateDbContext();
            history = (await db.Database.GetAppliedMigrationsAsync(cancellationToken)).ToArray();
            Assert.Single(await db.Users.ToListAsync(cancellationToken));
            Assert.Single(await db.UgUnits.ToListAsync(cancellationToken));
            Assert.Single(await db.EmailOutboxMessages.ToListAsync(cancellationToken));
            Assert.NotEmpty(await db.DataProtectionKeys.ToListAsync(cancellationToken));
        }

        await fixture.ResetAsync();

        await using var verification = fixture.CreateDbContext();
        Assert.Equal(
            history,
            await verification.Database.GetAppliedMigrationsAsync(cancellationToken)
        );
        Assert.Empty(await verification.Users.ToListAsync(cancellationToken));
        Assert.Empty(await verification.Roles.ToListAsync(cancellationToken));
        Assert.Empty(await verification.UgUnits.ToListAsync(cancellationToken));
        Assert.Empty(await verification.EmailOutboxMessages.ToListAsync(cancellationToken));
        Assert.Empty(await verification.DataProtectionKeys.ToListAsync(cancellationToken));
    }
}
