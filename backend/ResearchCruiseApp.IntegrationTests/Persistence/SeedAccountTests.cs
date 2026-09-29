using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Identity;
using ResearchCruiseApp.Infrastructure.Persistence;
using ResearchCruiseApp.IntegrationTests.Auth;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Persistence;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class SeedAccountTests(SqlFixture fixture) : IAsyncLifetime
{
    private const string Email = "seed@example.invalid";

    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    // BE-STARTUP-003: repair once, then retain the repaired identity and password.
    [Fact]
    public async Task Seed_WhenAccountIsIncomplete_RepairsOnceAndPreservesCredentialsOnRepeat()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var original = await CreateIncomplete(app);
        await using (var scope = app.Services.CreateAsyncScope())
        {
            var result = await scope
                .ServiceProvider.GetRequiredService<IdentityService>()
                .EnsureSeedUserWithRole(
                    Email,
                    "Seed",
                    "Researcher",
                    TestUsers.Password,
                    RoleName.CruiseManager
                );
            Assert.True(result.IsSuccess);
            Assert.Equal(SeedUserStatus.Created, result.Data);
        }
        string repairedId = "";
        string? passwordHash = null;
        Guid messageId = default;
        await app.InDatabase(async db =>
        {
            var user = Assert.Single(await db.Users.ToListAsync(ct));
            repairedId = user.Id;
            passwordHash = user.PasswordHash;
            Assert.NotEqual(original.Id, repairedId);
            Assert.NotNull(passwordHash);
            Assert.True(user.Accepted);
            Assert.True(user.EmailConfirmed);
            Assert.Equal(user.Id, Assert.Single(await db.UserRoles.ToListAsync(ct)).UserId);
            messageId = Assert.Single(await db.EmailOutboxMessages.ToListAsync(ct)).Id;
        });
        await using (var scope = app.Services.CreateAsyncScope())
        {
            var result = await scope
                .ServiceProvider.GetRequiredService<IdentityService>()
                .EnsureSeedUserWithRole(
                    Email,
                    "Changed",
                    "Name",
                    "DifferentPassword2!",
                    RoleName.CruiseManager
                );
            Assert.True(result.IsSuccess);
            Assert.Equal(SeedUserStatus.AlreadyComplete, result.Data);
            var users = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            var user = await users.FindByEmailAsync(Email);
            Assert.NotNull(user);
            Assert.True(await users.CheckPasswordAsync(user, TestUsers.Password));
            Assert.False(await users.CheckPasswordAsync(user, "DifferentPassword2!"));
            Assert.True(await users.IsInRoleAsync(user, RoleName.CruiseManager));
        }
        await app.InDatabase(async db =>
        {
            var user = Assert.Single(await db.Users.ToListAsync(ct));
            Assert.Equal(repairedId, user.Id);
            Assert.Equal(passwordHash, user.PasswordHash);
            Assert.Equal("Seed", user.FirstName);
            Assert.Equal("Researcher", user.LastName);
            Assert.Single(await db.UserRoles.ToListAsync(ct));
            Assert.Equal(messageId, Assert.Single(await db.EmailOutboxMessages.ToListAsync(ct)).Id);
        });
        Assert.Empty(app.Transport.Messages);
        await app.Dispatch(ct);
        Assert.Equal(messageId, Assert.Single(app.Transport.Messages).Id);
        await app.InDatabase(async db =>
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct))
        );
    }

    // BE-STARTUP-004: the caller owns the transaction for account, membership and email.
    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public async Task Seed_WhenCallerOwnsTransaction_CommitsOrRollsBackWithCaller(bool commit)
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        await RegistrationTests.EnsureRegistrationRole(app);
        await using (var scope = app.Services.CreateAsyncScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            await using var transaction = await db.Database.BeginTransactionAsync(ct);
            var result = await scope
                .ServiceProvider.GetRequiredService<IdentityService>()
                .EnsureSeedUserWithRole(
                    Email,
                    "Seed",
                    "Researcher",
                    TestUsers.Password,
                    RoleName.CruiseManager
                );
            Assert.True(result.IsSuccess);
            Assert.Same(transaction, db.Database.CurrentTransaction);
            Assert.Single(await db.Users.ToListAsync(ct));
            Assert.Single(await db.UserRoles.ToListAsync(ct));
            Assert.Single(await db.EmailOutboxMessages.ToListAsync(ct));
            Assert.Empty(app.Transport.Messages);
            if (commit)
                await transaction.CommitAsync(ct);
            else
                await transaction.RollbackAsync(ct);
        }
        await app.InDatabase(async db =>
        {
            Assert.Equal(commit ? 1 : 0, await db.Users.CountAsync(ct));
            Assert.Equal(commit ? 1 : 0, await db.UserRoles.CountAsync(ct));
            Assert.Equal(commit ? 1 : 0, await db.EmailOutboxMessages.CountAsync(ct));
            Assert.Single(await db.Roles.ToListAsync(ct));
        });
        await app.Dispatch(ct);
        Assert.Equal(commit ? 1 : 0, app.Transport.Messages.Count);
        await app.InDatabase(async db =>
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct))
        );
    }

    // BE-STARTUP-005: a failed repair preserves the original account and earlier caller writes.
    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public async Task Seed_WhenRepairFails_PreservesOriginalAndAllowsCallerCommit(bool queueFailure)
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var original = await CreateIncomplete(app);
        var callerRow = new UgUnit { Name = "Unrelated caller write", IsActive = true };
        if (queueFailure)
            await app.InDatabase(db =>
                db.Database.ExecuteSqlRawAsync(
                    "ALTER TABLE [EmailOutboxMessages] ADD CONSTRAINT [CK_TestSeedOutbox] CHECK ([Attempts] < 0)",
                    ct
                )
            );
        try
        {
            await using var scope = app.Services.CreateAsyncScope();
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            await using var transaction = await db.Database.BeginTransactionAsync(ct);
            db.UgUnits.Add(callerRow);
            await db.SaveChangesAsync(ct);
            var identity = scope.ServiceProvider.GetRequiredService<IdentityService>();
            if (queueFailure)
                await Assert.ThrowsAsync<DbUpdateException>(() =>
                    identity.EnsureSeedUserWithRole(
                        Email,
                        "Replacement",
                        "Researcher",
                        TestUsers.Password,
                        RoleName.CruiseManager
                    )
                );
            else
                Assert.False(
                    (
                        await identity.EnsureSeedUserWithRole(
                            Email,
                            "Replacement",
                            "Researcher",
                            "bad",
                            RoleName.CruiseManager
                        )
                    ).IsSuccess
                );
            Assert.Same(transaction, db.Database.CurrentTransaction);
            await transaction.CommitAsync(ct);
            await app.InDatabase(async verification =>
            {
                var user = Assert.Single(await verification.Users.ToListAsync(ct));
                Assert.Equal(original.Id, user.Id);
                Assert.Equal(original.FirstName, user.FirstName);
                Assert.Equal(original.LastName, user.LastName);
                Assert.Null(user.PasswordHash);
                Assert.False(user.Accepted);
                Assert.False(user.EmailConfirmed);
                Assert.Empty(await verification.UserRoles.ToListAsync(ct));
                Assert.Empty(await verification.EmailOutboxMessages.ToListAsync(ct));
                Assert.Equal(
                    callerRow.Id,
                    Assert.Single(await verification.UgUnits.ToListAsync(ct)).Id
                );
            });
            Assert.Empty(app.Transport.Messages);
        }
        finally
        {
            if (queueFailure)
                await app.InDatabase(db =>
                    db.Database.ExecuteSqlRawAsync(
                        "ALTER TABLE [EmailOutboxMessages] DROP CONSTRAINT [CK_TestSeedOutbox]",
                        ct
                    )
                );
        }
    }

    private static async Task<User> CreateIncomplete(TestApplication app)
    {
        await RegistrationTests.EnsureRegistrationRole(app);
        await using var scope = app.Services.CreateAsyncScope();
        var original = new User
        {
            UserName = Email,
            Email = Email,
            FirstName = "Original",
            LastName = "Account",
        };
        Assert.True(
            (
                await scope
                    .ServiceProvider.GetRequiredService<UserManager<User>>()
                    .CreateAsync(original)
            ).Succeeded
        );
        return original;
    }
}
