using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Users;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Auth;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class PasswordChangeTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    // BE-ACCOUNT-004: failed changes preserve the session; a successful change revokes refresh.
    [Fact]
    public async Task ChangePassword_WhenCurrentPasswordIsVerified_ReplacesPasswordAndRevokesRefresh()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var user = await TestUsers.Create(app, "change@example.invalid", RoleName.CruiseManager);
        using var client = app.CreateApiClient();
        var session = await RefreshSessionTests.Login(client, user.Email!);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            session.Access
        );
        string? passwordHash = null;
        string? refreshHash = null;
        await app.InDatabase(async db =>
        {
            var stored = await db.Users.SingleAsync(ct);
            passwordHash = stored.PasswordHash;
            refreshHash = stored.RefreshToken;
        });
        const string replacement = "ReplacementPassword2!";
        ChangePasswordRequest[] rejected =
        [
            new("IncorrectPassword1!", replacement),
            new(TestUsers.Password, "weak"),
        ];
        foreach (var request in rejected)
        {
            using var denied = await client.PatchAsJsonAsync("/v2/users/me/password", request, ct);
            Assert.Equal(HttpStatusCode.BadRequest, denied.StatusCode);
            await app.InDatabase(async db =>
            {
                var stored = await db.Users.SingleAsync(ct);
                Assert.Equal(passwordHash, stored.PasswordHash);
                Assert.Equal(refreshHash, stored.RefreshToken);
                Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
            });
        }
        using var changed = await client.PatchAsJsonAsync(
            "/v2/users/me/password",
            new ChangePasswordRequest(TestUsers.Password, replacement),
            ct
        );
        Assert.Equal(HttpStatusCode.NoContent, changed.StatusCode);
        await app.InDatabase(async db =>
        {
            var stored = await db.Users.SingleAsync(ct);
            Assert.NotEqual(passwordHash, stored.PasswordHash);
            Assert.Null(stored.RefreshToken);
            Assert.Null(stored.RefreshTokenExpiry);
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        using var refresh = await RefreshSessionTests.SendCookie(
            client,
            "/v2/auth/refresh",
            session.Cookie
        );
        Assert.Equal(HttpStatusCode.Unauthorized, refresh.StatusCode);
        using var oldLogin = await client.PostAsJsonAsync(
            "/v2/auth/login",
            new { user.Email, Password = TestUsers.Password },
            ct
        );
        Assert.Equal(HttpStatusCode.Unauthorized, oldLogin.StatusCode);
        using var newLogin = await client.PostAsJsonAsync(
            "/v2/auth/login",
            new { user.Email, Password = replacement },
            ct
        );
        Assert.Equal(HttpStatusCode.OK, newLogin.StatusCode);
        Assert.Empty(app.Transport.Messages);
    }

    // BE-ACCOUNT-006: unauthenticated or malformed changes cannot alter credentials or sessions.
    [Fact]
    public async Task ChangePassword_WhenUnauthenticatedOrMalformed_PreservesCredentialsAndSession()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var user = await TestUsers.Create(app, "binding@example.invalid", RoleName.CruiseManager);
        using var client = app.CreateApiClient();
        var session = await RefreshSessionTests.Login(client, user.Email!);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            session.Access
        );
        string? passwordHash = null;
        string? refreshHash = null;
        await app.InDatabase(async db =>
        {
            var stored = await db.Users.SingleAsync(ct);
            passwordHash = stored.PasswordHash;
            refreshHash = stored.RefreshToken;
        });
        using var anonymous = app.CreateApiClient();
        using var denied = await anonymous.PatchAsJsonAsync(
            "/v2/users/me/password",
            new ChangePasswordRequest(TestUsers.Password, "ReplacementPassword2!"),
            ct
        );
        Assert.Equal(HttpStatusCode.Unauthorized, denied.StatusCode);
        string[] bodies =
        [
            """{"newPassword":"ReplacementPassword2!"}""",
            """{"password":"SyntheticPassword1!"}""",
            """{"password":"SyntheticPassword1!","newPassword":null}""",
            """{"password":123,"newPassword":"ReplacementPassword2!"}""",
        ];
        foreach (var body in bodies)
        {
            using var content = new StringContent(
                body,
                System.Text.Encoding.UTF8,
                "application/json"
            );
            using var response = await client.PatchAsync("/v2/users/me/password", content, ct);
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            await app.InDatabase(async db =>
            {
                var stored = await db.Users.SingleAsync(ct);
                Assert.Equal(passwordHash, stored.PasswordHash);
                Assert.Equal(refreshHash, stored.RefreshToken);
                Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
            });
        }
        using var refresh = await RefreshSessionTests.SendCookie(
            client,
            "/v2/auth/refresh",
            session.Cookie
        );
        Assert.Equal(HttpStatusCode.OK, refresh.StatusCode);
        Assert.Empty(app.Transport.Messages);
    }
}
