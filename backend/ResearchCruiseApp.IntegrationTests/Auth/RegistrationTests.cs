using System.Net;
using System.Net.Http.Json;
using System.Text;
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
            Assert.Null(user.PasswordHash);
            Assert.Null(user.RefreshToken);
            var membership = Assert.Single(await db.UserRoles.ToListAsync(ct));
            Assert.Equal(user.Id, membership.UserId);
            var role = await db.Roles.SingleAsync(ct);
            Assert.Equal(RoleName.CruiseManager, role.Name);
            Assert.Equal(role.Id, membership.RoleId);
            var message = Assert.Single(await db.EmailOutboxMessages.ToListAsync(ct));
            Assert.Equal(0, message.Attempts);
            Assert.DoesNotContain(user.Email!, message.ProtectedPayload, StringComparison.Ordinal);
        });
        await app.Dispatch(ct);
        SentLink(app, "registration@example.invalid");
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

    [Fact]
    public async Task Register_WhenLegacyAccountHasPassword_RemovesItAndInvalidatesOldConfirmation()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        using var client = app.CreateApiClient();
        const string email = "legacy@example.invalid";
        const string chosenPassword = "OwnerPassword3!";
        var legacy = await TestUsers.Create(app, email, RoleName.CruiseManager);
        await app.InDatabase(db =>
            db.Users.ExecuteUpdateAsync(
                set =>
                    set.SetProperty(user => user.EmailConfirmed, false)
                        .SetProperty(user => user.Accepted, false),
                ct
            )
        );
        string oldCode;
        await using (var scope = app.Services.CreateAsyncScope())
        {
            var users = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            var stored = await users.FindByIdAsync(legacy.Id);
            Assert.NotNull(stored!.PasswordHash);
            oldCode = WebEncoders.Base64UrlEncode(
                Encoding.UTF8.GetBytes(await users.GenerateEmailConfirmationTokenAsync(stored))
            );
        }

        using var registered = await Register(client, email, "Replaced", ct);
        Assert.Equal(HttpStatusCode.Created, registered.StatusCode);
        await app.Dispatch(ct);
        var setPassword = QueryHelpers.ParseQuery(SentLink(app, email).Query);

        using var oldConfirm = await client.GetAsync(
            $"/v2/auth/confirm-email?userId={legacy.Id}&code={Uri.EscapeDataString(oldCode)}",
            ct
        );
        Assert.Equal(HttpStatusCode.BadRequest, oldConfirm.StatusCode);
        await app.InDatabase(async db =>
        {
            var stored = await db.Users.SingleAsync(ct);
            Assert.Null(stored.PasswordHash);
            Assert.False(stored.EmailConfirmed);
        });
        await app.InDatabase(db =>
            db.Users.ExecuteUpdateAsync(set => set.SetProperty(user => user.Accepted, true), ct)
        );
        using var oldLogin = await client.PostAsJsonAsync(
            "/v2/auth/login",
            new { Email = email, Password = TestUsers.Password },
            ct
        );
        Assert.Equal(HttpStatusCode.Unauthorized, oldLogin.StatusCode);

        using var passwordSet = await SetPassword(
            client,
            setPassword["emailBase64"]!,
            setPassword["resetCode"]!,
            chosenPassword,
            ct
        );
        Assert.Equal(HttpStatusCode.NoContent, passwordSet.StatusCode);
        await app.InDatabase(async db =>
            Assert.True((await db.Users.SingleAsync(ct)).EmailConfirmed)
        );
        using var login = await client.PostAsJsonAsync(
            "/v2/auth/login",
            new { Email = email, Password = chosenPassword },
            ct
        );
        Assert.Equal(HttpStatusCode.OK, login.StatusCode);
    }

    [Fact]
    public async Task Register_WhenRepeated_OnlyLatestSetPasswordLinkConfirmsAndSetsLoginPassword()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        await EnsureRegistrationRole(app);
        using var client = app.CreateApiClient();
        const string email = "again@example.invalid";
        const string submittedPassword = "SubmittedPassword2!";
        const string chosenPassword = "OwnerPassword3!";

        using var first = await client.PostAsJsonAsync(
            "/v2/auth/register",
            new
            {
                Email = email,
                Password = submittedPassword,
                FirstName = "Original",
                LastName = "Researcher",
            },
            ct
        );
        Assert.Equal(HttpStatusCode.Created, first.StatusCode);
        await app.Dispatch(ct);
        var oldLink = QueryHelpers.ParseQuery(SentLink(app, email).Query);
        app.Transport.Messages.Clear();

        using var second = await Register(client, email, "Replaced", ct);
        Assert.Equal(first.StatusCode, second.StatusCode);
        Assert.Equal(
            await first.Content.ReadAsStringAsync(ct),
            await second.Content.ReadAsStringAsync(ct)
        );
        await app.Dispatch(ct);
        var setPassword = QueryHelpers.ParseQuery(SentLink(app, email).Query);
        await app.InDatabase(async db =>
        {
            var stored = await db.Users.SingleAsync(ct);
            Assert.Null(stored.PasswordHash);
            Assert.False(stored.EmailConfirmed);
            Assert.Equal("Original", stored.FirstName);
            Assert.Single(await db.UserRoles.ToListAsync(ct));
        });
        using var oldSet = await SetPassword(
            client,
            oldLink["emailBase64"]!,
            oldLink["resetCode"]!,
            submittedPassword,
            ct
        );
        Assert.Equal(HttpStatusCode.BadRequest, oldSet.StatusCode);

        using var passwordSet = await SetPassword(
            client,
            setPassword["emailBase64"]!,
            setPassword["resetCode"]!,
            chosenPassword,
            ct
        );
        Assert.Equal(HttpStatusCode.NoContent, passwordSet.StatusCode);
        await app.InDatabase(async db =>
            Assert.True((await db.Users.SingleAsync(ct)).EmailConfirmed)
        );

        await app.InDatabase(db =>
            db.Users.ExecuteUpdateAsync(set => set.SetProperty(user => user.Accepted, true), ct)
        );
        using var rejected = await client.PostAsJsonAsync(
            "/v2/auth/login",
            new { Email = email, Password = submittedPassword },
            ct
        );
        Assert.Equal(HttpStatusCode.Unauthorized, rejected.StatusCode);
        using var login = await client.PostAsJsonAsync(
            "/v2/auth/login",
            new { Email = email, Password = chosenPassword },
            ct
        );
        Assert.Equal(HttpStatusCode.OK, login.StatusCode);
    }

    [Fact]
    public async Task SetPassword_WhenOfficeChangedEmailAfterLinkWasSent_RejectsOldLinkForNewEmail()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        await EnsureRegistrationRole(app);
        var office = await TestUsers.Create(app, "office@example.invalid", RoleName.Administrator);
        using var client = app.CreateApiClient();
        const string oldEmail = "old-address@example.invalid";
        const string newEmail = "new-address@example.invalid";
        const string password = "OwnerPassword3!";

        using var registered = await Register(client, oldEmail, "Original", ct);
        await app.Dispatch(ct);
        var oldLink = QueryHelpers.ParseQuery(SentLink(app, oldEmail).Query);
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
        await app.Dispatch(ct);
        var newLink = QueryHelpers.ParseQuery(SentLink(app, newEmail).Query);
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
            Assert.Null(stored.PasswordHash);
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

    private static Uri SentLink(TestApplication app, string recipient) =>
        PasswordRecoveryTests.Link(
            Assert
                .Single(app.Transport.Messages, message => message.Payload.Recipient == recipient)
                .Payload.Body,
            "reset-password"
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

    [Theory]
    [InlineData(true, false, false)]
    [InlineData(false, true, false)]
    [InlineData(false, false, true)]
    public async Task Register_WhenEmailBelongsToConfirmedAcceptedOrReferencedAccount_IsRefused(
        bool emailConfirmed,
        bool accepted,
        bool referenced
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        await EnsureRegistrationRole(app);
        var existing = await TestUsers.Create(app, "old@example.invalid", RoleName.CruiseManager);
        const string email = "changed@example.invalid";
        await app.InDatabase(db =>
            db.Users.ExecuteUpdateAsync(
                set =>
                    set.SetProperty(user => user.Email, email)
                        .SetProperty(user => user.NormalizedEmail, email.ToUpperInvariant())
                        .SetProperty(user => user.EmailConfirmed, emailConfirmed)
                        .SetProperty(user => user.Accepted, accepted),
                ct
            )
        );
        if (referenced)
            await app.InDatabase(db =>
            {
                db.UserPublications.Add(
                    new UserPublication
                    {
                        UserId = Guid.Parse(existing.Id),
                        Publication = new Publication
                        {
                            Category = "subject",
                            MinisterialPoints = "0",
                        },
                    }
                );
                return db.SaveChangesAsync(ct);
            });
        using var client = app.CreateApiClient();

        using var response = await Register(client, email, "Replaced", ct);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        await app.InDatabase(async db =>
        {
            var stored = Assert.Single(await db.Users.ToListAsync(ct));
            Assert.Equal(existing.PasswordHash, stored.PasswordHash);
            Assert.Equal(existing.FirstName, stored.FirstName);
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
    }

    private static Task<HttpResponseMessage> Register(
        HttpClient client,
        string email,
        string firstName,
        CancellationToken ct
    ) =>
        client.PostAsJsonAsync(
            "/v2/auth/register",
            new
            {
                Email = email,
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
