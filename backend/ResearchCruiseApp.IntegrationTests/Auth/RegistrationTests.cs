using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Identity;
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

    // BE-ACCOUNT-001: registration commits Identity membership and protected confirmation together.
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

    // BE-ATOMIC-001: a real SQL queue failure rolls back account and role writes.
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

        // The same request succeeds after removing only the injected persistence fault.
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

    internal static async Task EnsureRegistrationRole(TestApplication app)
    {
        await using var scope = app.Services.CreateAsyncScope();
        var roles = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        Assert.True((await roles.CreateAsync(new IdentityRole(RoleName.CruiseManager))).Succeeded);
    }
}
