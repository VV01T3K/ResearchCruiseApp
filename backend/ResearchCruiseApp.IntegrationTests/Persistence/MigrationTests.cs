using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Persistence;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class MigrationTests(SqlFixture fixture)
{
    // BE-MIGRATION-001: fixture setup must apply the real chain to an empty SQL database.
    [Fact]
    public async Task Migrate_WhenAppliedAgain_PreservesHistoryAndMatchesCurrentModel()
    {
        await using var db = fixture.CreateDbContext();
        var before = (
            await db.Database.GetAppliedMigrationsAsync(TestContext.Current.CancellationToken)
        ).ToArray();
        Assert.NotEmpty(before);
        Assert.Equal(db.Database.GetMigrations(), before);
        Assert.Empty(
            await db.Database.GetPendingMigrationsAsync(TestContext.Current.CancellationToken)
        );
        Assert.False(db.Database.HasPendingModelChanges());

        await db.Database.MigrateAsync(TestContext.Current.CancellationToken);

        await using var verification = fixture.CreateDbContext();
        Assert.Equal(
            before,
            await verification.Database.GetAppliedMigrationsAsync(
                TestContext.Current.CancellationToken
            )
        );
    }
}
