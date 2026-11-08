using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Infrastructure.Identity;
using ResearchCruiseApp.Infrastructure.Persistence;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Auth;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class EmailChangeTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    [Fact]
    public async Task UpdateUser_WhenOfficeChangesEmail_ReleasesOldAddressAndKeepsNewOneUsable()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        await RegistrationTests.EnsureRegistrationRole(app);
        var admin = await TestUsers.Create(app, "admin@example.invalid", RoleName.Administrator);
        var user = await TestUsers.Create(app, "old@example.invalid", RoleName.CruiseManager);
        using var office = await TestApplications.Login(app, admin.Email!);
        using var client = app.CreateApiClient();

        using var updated = await office.PatchAsJsonAsync(
            $"/v2/users/{user.Id}",
            new { Email = "new@example.invalid" },
            ct
        );
        Assert.Equal(HttpStatusCode.NoContent, updated.StatusCode);
        await app.InDatabase(async db =>
        {
            var stored = await db.Users.SingleAsync(row => row.Id == user.Id, ct);
            Assert.Equal("new@example.invalid", stored.UserName);
            Assert.Equal("NEW@EXAMPLE.INVALID", stored.NormalizedUserName);
        });
        using var registered = await client.PostAsJsonAsync(
            "/v2/auth/register",
            new
            {
                Email = "old@example.invalid",
                Password = TestUsers.Password,
                FirstName = "Other",
                LastName = "Researcher",
            },
            ct
        );
        Assert.Equal(HttpStatusCode.Created, registered.StatusCode);
        await app.InDatabase(async db =>
            Assert.True(
                await db.Users.AnyAsync(
                    row => row.Email == "old@example.invalid" && row.Id != user.Id,
                    ct
                )
            )
        );

        await app.Dispatch(ct);
        var confirmation = Assert.Single(
            app.Transport.Messages,
            message => message.Payload.Recipient == "new@example.invalid"
        );
        using var confirmed = await client.GetAsync(
            "/v2/auth/confirm-email"
                + PasswordRecoveryTests.Link(confirmation.Payload.Body, "confirm-email").Query,
            ct
        );
        Assert.Equal(HttpStatusCode.NoContent, confirmed.StatusCode);
        await RefreshSessionTests.Login(client, "new@example.invalid");
        using var resetRequested = await client.PostAsJsonAsync(
            "/v2/auth/password-reset-request",
            new { Email = "new@example.invalid" },
            ct
        );
        Assert.Equal(HttpStatusCode.NoContent, resetRequested.StatusCode);
        await app.Dispatch(ct);
        var reset = QueryHelpers.ParseQuery(
            PasswordRecoveryTests
                .Link(app.Transport.Messages[^1].Payload.Body, "reset-password")
                .Query
        );
        using var resetDone = await client.PostAsJsonAsync(
            "/v2/auth/password-reset",
            new
            {
                EmailBase64 = reset["emailBase64"].ToString(),
                ResetCode = reset["resetCode"].ToString(),
                Password = TestUsers.Password,
                PasswordConfirm = TestUsers.Password,
            },
            ct
        );
        Assert.Equal(HttpStatusCode.NoContent, resetDone.StatusCode);
    }

    [Fact]
    public async Task UpdateUser_WhenEmailIsAnotherUsersUserName_ReturnsConflictAndKeepsAccount()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var admin = await TestUsers.Create(app, "admin@example.invalid", RoleName.Administrator);
        var user = await TestUsers.Create(app, "user@example.invalid");
        var other = await TestUsers.Create(app, "other@example.invalid");
        await app.InDatabase(async db =>
            await db
                .Users.Where(row => row.Id == other.Id)
                .ExecuteUpdateAsync(
                    row =>
                        row.SetProperty(u => u.Email, "moved@example.invalid")
                            .SetProperty(u => u.NormalizedEmail, "MOVED@EXAMPLE.INVALID"),
                    ct
                )
        );
        using var office = await TestApplications.Login(app, admin.Email!);

        using var updated = await office.PatchAsJsonAsync(
            $"/v2/users/{user.Id}",
            new { Email = "other@example.invalid", FirstName = "Changed" },
            ct
        );

        Assert.Equal(HttpStatusCode.Conflict, updated.StatusCode);
        await app.InDatabase(async db =>
        {
            var stored = await db.Users.SingleAsync(row => row.Id == user.Id, ct);
            Assert.Equal(
                ("user@example.invalid", "user@example.invalid", "Test", true, user.SecurityStamp),
                (
                    stored.Email,
                    stored.UserName,
                    stored.FirstName,
                    stored.EmailConfirmed,
                    stored.SecurityStamp
                )
            );
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
    }

    [Fact]
    public async Task SyncUserNamesWithEmails_WhenUserNamesAreSwapped_RepairsThemAndKeepsSharedEmails()
    {
        var ct = TestContext.Current.CancellationToken;
        var connection = new SqlConnectionStringBuilder(fixture.ConnectionString);
        connection.InitialCatalog += "_UserNames";
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseSqlServer(connection.ConnectionString)
            .Options;
        await using var db = new ApplicationDbContext(options);
        var migrator = db.GetService<IMigrator>();
        const string previous = "20261108015102_AddFormAPrecisePeriodTimes";
        try
        {
            await migrator.MigrateAsync(previous, ct);
            User Account(string email, string userName) =>
                new()
                {
                    Email = email,
                    NormalizedEmail = email.ToUpperInvariant(),
                    UserName = userName,
                    NormalizedUserName = userName.ToUpperInvariant(),
                    FirstName = "Test",
                    LastName = "Researcher",
                    PasswordHash = $"hash-{email}",
                };
            User[] repaired =
            [
                Account("a@example.invalid", "b@example.invalid"),
                Account("b@example.invalid", "a@example.invalid"),
                Account("Case@example.invalid", "case@example.invalid"),
            ];
            User[] kept =
            [
                Account("shared@example.invalid", "shared@example.invalid"),
                Account("SHARED@example.invalid", "legacy@example.invalid"),
                Account("legacy@example.invalid", "chain@example.invalid"),
            ];
            db.Users.AddRange([.. repaired, .. kept]);
            await db.SaveChangesAsync(ct);

            for (var run = 0; run < 2; run++)
            {
                await migrator.MigrateAsync(previous, ct);
                await db.Database.MigrateAsync(ct);
                await using var verification = new ApplicationDbContext(options);
                var stored = await verification.Users.ToDictionaryAsync(row => row.Id, ct);
                Assert.All(
                    repaired,
                    user =>
                        Assert.Equal(
                            (user.Email, user.NormalizedEmail, user.PasswordHash),
                            (
                                stored[user.Id].UserName,
                                stored[user.Id].NormalizedUserName,
                                stored[user.Id].PasswordHash
                            )
                        )
                );
                Assert.All(
                    kept,
                    user =>
                        Assert.Equal(
                            (user.UserName, user.NormalizedUserName),
                            (stored[user.Id].UserName, stored[user.Id].NormalizedUserName)
                        )
                );
            }
        }
        finally
        {
            await db.Database.EnsureDeletedAsync(CancellationToken.None);
        }
    }
}
