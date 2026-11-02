using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using ResearchCruiseApp.Domain;
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

    [Fact]
    public async Task Register_WhenEmailBelongsToUnconfirmedAccount_ReplacesItAndItsOldLink()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        await EnsureRegistrationRole(app);
        using var client = app.CreateApiClient();
        const string email = "again@example.invalid";
        const string newPassword = "ReplacementPassword2!";

        using var first = await Register(client, email, TestUsers.Password, "Original", ct);
        Assert.Equal(HttpStatusCode.Created, first.StatusCode);
        await app.Dispatch(ct);
        var oldLink = PasswordRecoveryTests.Link(
            app.Transport.Messages[^1].Payload.Body,
            "confirm-email"
        );

        using var second = await Register(client, email, newPassword, "Replaced", ct);
        Assert.Equal(first.StatusCode, second.StatusCode);
        Assert.Equal(
            await first.Content.ReadAsStringAsync(ct),
            await second.Content.ReadAsStringAsync(ct)
        );
        await app.Dispatch(ct);
        var newLink = PasswordRecoveryTests.Link(
            app.Transport.Messages[^1].Payload.Body,
            "confirm-email"
        );

        Assert.Equal(
            QueryHelpers.ParseQuery(oldLink.Query)["userId"],
            QueryHelpers.ParseQuery(newLink.Query)["userId"]
        );
        await app.InDatabase(async db =>
        {
            Assert.Equal("Replaced", (await db.Users.SingleAsync(ct)).FirstName);
            Assert.Single(await db.UserRoles.ToListAsync(ct));
        });
        using var oldConfirm = await client.GetAsync("/v2/auth/confirm-email" + oldLink.Query, ct);
        Assert.Equal(HttpStatusCode.BadRequest, oldConfirm.StatusCode);
        using var newConfirm = await client.GetAsync("/v2/auth/confirm-email" + newLink.Query, ct);
        Assert.Equal(HttpStatusCode.NoContent, newConfirm.StatusCode);

        await app.InDatabase(db =>
            db.Users.ExecuteUpdateAsync(set => set.SetProperty(user => user.Accepted, true), ct)
        );
        using var login = await client.PostAsJsonAsync(
            "/v2/auth/login",
            new { Email = email, Password = newPassword },
            ct
        );
        Assert.Equal(HttpStatusCode.OK, login.StatusCode);
    }

    [Theory]
    [InlineData(true, false)]
    [InlineData(false, true)]
    public async Task Register_WhenEmailBelongsToConfirmedOrAcceptedAccount_IsRefused(
        bool emailConfirmed,
        bool accepted
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
        using var client = app.CreateApiClient();

        using var response = await Register(client, email, "ReplacementPassword2!", "Replaced", ct);

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
