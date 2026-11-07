using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Identity;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Auth;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class RegistrationTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    [Fact]
    public async Task Register_WhenSmtpIsUnavailable_CommitsAccountAndRetryableConfirmation()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        await EnsureRegistrationRole(app);
        app.Transport.OnDeliver = (_, _, _) => throw new IOException("Synthetic SMTP outage");
        using var client = app.CreateApiClient();

        using var response = await client.PostAsJsonAsync(
            "/v2/auth/register",
            new
            {
                Email = "registration@example.invalid",
                Password = TestUsers.Password,
                FirstName = "New",
                LastName = "Researcher",
            },
            ct
        );

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        Assert.Empty(app.Transport.Messages);
        await app.InDatabase(async db =>
        {
            var user = Assert.Single(await db.Users.ToListAsync(ct));
            Assert.Equal("registration@example.invalid", user.Email);
            Assert.False(user.Accepted);
            Assert.False(user.EmailConfirmed);
            Assert.Null(user.RefreshToken);
            Assert.Equal(app.Clock.GetUtcNow().UtcDateTime, user.RegistrationPendingSince);
            var membership = Assert.Single(await db.UserRoles.ToListAsync(ct));
            Assert.Equal(user.Id, membership.UserId);
            var role = await db.Roles.SingleAsync(ct);
            Assert.Equal(RoleName.CruiseManager, role.Name);
            Assert.Equal(role.Id, membership.RoleId);
            var message = Assert.Single(await db.EmailOutboxMessages.ToListAsync(ct));
            Assert.Equal(0, message.Attempts);
            Assert.DoesNotContain(user.Email!, message.ProtectedPayload, StringComparison.Ordinal);
            Assert.DoesNotContain(
                TestUsers.Password,
                message.ProtectedPayload,
                StringComparison.Ordinal
            );
        });
        await app.Dispatch(ct);
        Assert.Single(app.Transport.Messages);
        await app.InDatabase(async db =>
        {
            Assert.Single(await db.Users.ToListAsync(ct));
            var message = Assert.Single(await db.EmailOutboxMessages.ToListAsync(ct));
            Assert.Equal(1, message.Attempts);
            Assert.Null(message.FailedAt);
            Assert.NotEmpty(message.ProtectedPayload);
        });
    }

    [Fact]
    public async Task Register_WhenQueuePersistenceFails_RollsBackAccountAndMembership()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        await EnsureRegistrationRole(app);
        using var client = app.CreateApiClient();
        await app.InDatabase(db =>
            db.Database.ExecuteSqlRawAsync(
                "ALTER TABLE [EmailOutboxMessages] ADD CONSTRAINT [CK_TestRejectOutbox] CHECK ([Attempts] < 0)",
                ct
            )
        );
        try
        {
            using var response = await client.PostAsJsonAsync(
                "/v2/auth/register",
                new
                {
                    Email = "rollback@example.invalid",
                    Password = TestUsers.Password,
                    FirstName = "Rollback",
                    LastName = "Researcher",
                },
                ct
            );

            Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
            Assert.Equal(
                "application/problem+json",
                response.Content.Headers.ContentType?.MediaType
            );
            var text = await response.Content.ReadAsStringAsync(ct);
            using var problem = System.Text.Json.JsonDocument.Parse(text);
            Assert.Equal(500, problem.RootElement.GetProperty("status").GetInt32());
            Assert.DoesNotContain("CK_TestRejectOutbox", text, StringComparison.Ordinal);
            Assert.DoesNotContain("SqlException", text, StringComparison.Ordinal);
            Assert.DoesNotContain("rollback@example.invalid", text, StringComparison.Ordinal);
            await app.InDatabase(async db =>
            {
                Assert.Empty(await db.Users.ToListAsync(ct));
                Assert.Empty(await db.UserRoles.ToListAsync(ct));
                Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
                Assert.Single(await db.Roles.ToListAsync(ct));
            });
            Assert.Empty(app.Transport.Messages);
        }
        finally
        {
            await app.InDatabase(db =>
                db.Database.ExecuteSqlRawAsync(
                    "ALTER TABLE [EmailOutboxMessages] DROP CONSTRAINT [CK_TestRejectOutbox]",
                    ct
                )
            );
        }

        using var recovered = await client.PostAsJsonAsync(
            "/v2/auth/register",
            new
            {
                Email = "rollback@example.invalid",
                Password = TestUsers.Password,
                FirstName = "Rollback",
                LastName = "Researcher",
            },
            ct
        );
        Assert.Equal(HttpStatusCode.Created, recovered.StatusCode);
        await app.InDatabase(async db =>
        {
            Assert.Single(await db.Users.ToListAsync(ct));
            Assert.Single(await db.UserRoles.ToListAsync(ct));
            Assert.Single(await db.EmailOutboxMessages.ToListAsync(ct));
        });
    }

    [Theory]
    [InlineData(false, false)]
    [InlineData(true, false)]
    [InlineData(true, true)]
    public async Task Register_WhenEmailExists_RespondsAsForNewAccountKeepsItAndEmailsOwner(
        bool emailConfirmed,
        bool accepted
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        await EnsureRegistrationRole(app);
        using var client = app.CreateApiClient();
        const string email = "taken@example.invalid";
        const string submittedPassword = "SubmittedPassword2!";
        using var fresh = await Register(
            client,
            "fresh@example.invalid",
            TestUsers.Password,
            "Fresh",
            ct
        );
        await app.Dispatch(ct);
        await TestUsers.Create(app, email, RoleName.CruiseManager);
        await app.InDatabase(db =>
            db.Users.Where(user => user.Email == email)
                .ExecuteUpdateAsync(
                    set =>
                        set.SetProperty(user => user.EmailConfirmed, emailConfirmed)
                            .SetProperty(user => user.Accepted, accepted),
                    ct
                )
        );
        User? original = null;
        await app.InDatabase(async db =>
            original = await db.Users.AsNoTracking().SingleAsync(user => user.Email == email, ct)
        );

        using var response = await Register(client, email, submittedPassword, "Replaced", ct);

        Assert.Equal(fresh.StatusCode, response.StatusCode);
        Assert.Equal(
            await fresh.Content.ReadAsStringAsync(ct),
            await response.Content.ReadAsStringAsync(ct)
        );
        await app.InDatabase(async db =>
        {
            var stored = await db.Users.SingleAsync(user => user.Email == email, ct);
            Assert.Equal(original!.PasswordHash, stored.PasswordHash);
            Assert.Equal(original.SecurityStamp, stored.SecurityStamp);
            Assert.Equal(original.FirstName, stored.FirstName);
            Assert.Equal(emailConfirmed, stored.EmailConfirmed);
            Assert.Equal(accepted, stored.Accepted);
        });
        await app.Dispatch(ct);
        var notice = Assert.Single(
            app.Transport.Messages,
            message => message.Payload.Recipient == email
        );
        Assert.Contains("https://tests.invalid/forgot-password", notice.Payload.Body);
        Assert.DoesNotContain("/confirm-email?", notice.Payload.Body, StringComparison.Ordinal);
        Assert.DoesNotContain("/reset-password?", notice.Payload.Body, StringComparison.Ordinal);
        using var login = await client.PostAsJsonAsync(
            "/v2/auth/login",
            new { Email = email, Password = submittedPassword },
            ct
        );
        Assert.Equal(HttpStatusCode.Unauthorized, login.StatusCode);

        using var weakFresh = await Register(client, "weak@example.invalid", "x", "Fresh", ct);
        using var weakExisting = await Register(client, email, "x", "Replaced", ct);
        Assert.Equal(HttpStatusCode.BadRequest, weakFresh.StatusCode);
        Assert.Equal(weakFresh.StatusCode, weakExisting.StatusCode);
        Assert.Equal(
            (await weakFresh.Content.ReadFromJsonAsync<JsonElement>(ct))
                .GetProperty("detail")
                .GetString(),
            (await weakExisting.Content.ReadFromJsonAsync<JsonElement>(ct))
                .GetProperty("detail")
                .GetString()
        );
    }

    [Fact]
    public async Task ResetPassword_WhenOfficeChangedEmailAfterLinkWasSent_RejectsOldLinkForNewEmail()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        await EnsureRegistrationRole(app);
        var office = await TestUsers.Create(app, "office@example.invalid", RoleName.Administrator);
        using var client = app.CreateApiClient();
        const string oldEmail = "old-address@example.invalid";
        const string newEmail = "new-address@example.invalid";
        const string password = "OwnerPassword3!";

        using var registered = await Register(client, oldEmail, TestUsers.Password, "Original", ct);
        using var oldRequest = await RequestReset(client, oldEmail, ct);
        await app.Dispatch(ct);
        var oldLink = QueryHelpers.ParseQuery(SentLink(app, oldEmail, "reset-password").Query);
        var userId = "";
        await app.InDatabase(async db =>
            userId = (await db.Users.SingleAsync(user => user.Email == oldEmail, ct)).Id
        );
        using var officeClient = await TestApplications.Login(app, office.Email!);
        using var changed = await officeClient.PatchAsJsonAsync(
            $"/v2/users/{userId}",
            new { Email = newEmail },
            ct
        );
        Assert.Equal(HttpStatusCode.NoContent, changed.StatusCode);
        using var newRequest = await RequestReset(client, newEmail, ct);
        await app.Dispatch(ct);
        var newLink = QueryHelpers.ParseQuery(SentLink(app, newEmail, "reset-password").Query);

        using var rejected = await SetPassword(
            client,
            newLink["emailBase64"]!,
            oldLink["resetCode"]!,
            password,
            ct
        );
        Assert.Equal(HttpStatusCode.BadRequest, rejected.StatusCode);
        await app.InDatabase(async db =>
        {
            var stored = await db.Users.SingleAsync(user => user.Id == userId, ct);
            Assert.False(stored.EmailConfirmed);
        });

        using var accepted = await SetPassword(
            client,
            newLink["emailBase64"]!,
            newLink["resetCode"]!,
            password,
            ct
        );
        Assert.Equal(HttpStatusCode.NoContent, accepted.StatusCode);
        await app.InDatabase(async db =>
            Assert.True((await db.Users.SingleAsync(user => user.Id == userId, ct)).EmailConfirmed)
        );
    }

    [Fact]
    public async Task DeleteStaleRegistrations_RemovesOnlyOldUnconfirmedUnacceptedUnreferencedAccounts()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var now = app.Clock.GetUtcNow().UtcDateTime;
        var accounts = new (string Email, int Days, bool Confirmed, bool Accepted, bool Kept)[]
        {
            ("stale@example.invalid", 8, false, false, false),
            ("recent@example.invalid", 6, false, false, true),
            ("confirmed@example.invalid", 8, true, false, true),
            ("accepted@example.invalid", 8, false, true, true),
            ("referenced@example.invalid", 8, false, false, true),
            ("deactivated@example.invalid", 8, false, false, true),
        };
        foreach (var account in accounts)
        {
            var user = await TestUsers.Create(app, account.Email, RoleName.CruiseManager);
            await app.InDatabase(db =>
                db.Users.Where(row => row.Id == user.Id)
                    .ExecuteUpdateAsync(
                        set =>
                            set.SetProperty(
                                    row => row.RegistrationPendingSince,
                                    now.AddDays(-account.Days)
                                )
                                .SetProperty(row => row.EmailConfirmed, account.Confirmed)
                                .SetProperty(row => row.Accepted, account.Accepted),
                        ct
                    )
            );
            if (account.Email.StartsWith("referenced", StringComparison.Ordinal))
                await AddPublication(app, user.Id);
            if (account.Email.StartsWith("deactivated", StringComparison.Ordinal))
            {
                await using (var scope = app.Services.CreateAsyncScope())
                    Assert.True(
                        (
                            await scope
                                .ServiceProvider.GetRequiredService<IdentityService>()
                                .AcceptUser(Guid.Parse(user.Id))
                        ).IsSuccess
                    );
                await app.InDatabase(db =>
                    db.Users.Where(row => row.Id == user.Id)
                        .ExecuteUpdateAsync(set => set.SetProperty(row => row.Accepted, false), ct)
                );
            }
        }

        await using (var scope = app.Services.CreateAsyncScope())
            await scope
                .ServiceProvider.GetRequiredService<IdentityService>()
                .DeleteStaleRegistrations(ct);

        await app.InDatabase(async db =>
        {
            var remaining = await db.Users.Select(user => user.Email).ToListAsync(ct);
            Assert.Equal(
                accounts.Where(account => account.Kept).Select(account => account.Email).Order(),
                remaining.Order()
            );
            Assert.Equal(remaining.Count, await db.UserRoles.CountAsync(ct));
        });
    }

    private static Task AddPublication(TestApplication app, string userId) =>
        app.InDatabase(db =>
        {
            db.UserPublications.Add(
                new UserPublication
                {
                    UserId = Guid.Parse(userId),
                    Publication = new Publication { Category = "subject", MinisterialPoints = "0" },
                }
            );
            return db.SaveChangesAsync(TestContext.Current.CancellationToken);
        });

    private static Task<HttpResponseMessage> RequestReset(
        HttpClient client,
        string email,
        CancellationToken ct
    ) => client.PostAsJsonAsync("/v2/auth/password-reset-request", new { Email = email }, ct);

    private static Uri SentLink(TestApplication app, string recipient, string route) =>
        PasswordRecoveryTests.Link(
            Assert
                .Single(
                    app.Transport.Messages,
                    message =>
                        message.Payload.Recipient == recipient
                        && message.Payload.Body.Contains($"/{route}?")
                )
                .Payload.Body,
            route
        );

    private static Task<HttpResponseMessage> SetPassword(
        HttpClient client,
        string emailBase64,
        string resetCode,
        string password,
        CancellationToken ct
    ) =>
        client.PostAsJsonAsync(
            "/v2/auth/password-reset",
            new
            {
                EmailBase64 = emailBase64,
                ResetCode = resetCode,
                Password = password,
                PasswordConfirm = password,
            },
            ct
        );

    private static Task<HttpResponseMessage> Register(
        HttpClient client,
        string email,
        string password,
        string firstName,
        CancellationToken ct
    ) =>
        client.PostAsJsonAsync(
            "/v2/auth/register",
            new
            {
                Email = email,
                Password = password,
                FirstName = firstName,
                LastName = "Researcher",
            },
            ct
        );

    internal static async Task EnsureRegistrationRole(TestApplication app)
    {
        await using var scope = app.Services.CreateAsyncScope();
        var roles = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        Assert.True((await roles.CreateAsync(new IdentityRole(RoleName.CruiseManager))).Succeeded);
    }
}
