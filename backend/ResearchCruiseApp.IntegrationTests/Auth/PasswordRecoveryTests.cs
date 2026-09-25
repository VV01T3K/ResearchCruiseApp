using System.Net;
using System.Net.Http.Json;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Auth;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class PasswordRecoveryTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    // BE-ACCOUNT-002: use the real emailed reset token and verify session revocation/replay.
    [Fact]
    public async Task ResetPassword_WhenEmailTokenIsUsed_ChangesPasswordRevokesSessionAndRejectsReplay()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var user = await TestUsers.Create(app, "recovery@example.invalid");
        using var client = app.CreateApiClient();
        var original = await RefreshSessionTests.Login(client, user.Email!);
        string? passwordHash = null;
        string? refreshHash = null;
        await app.InDatabase(async db =>
        {
            var stored = await db.Users.SingleAsync(ct);
            passwordHash = stored.PasswordHash;
            refreshHash = stored.RefreshToken;
        });
        using var requested = await client.PostAsJsonAsync(
            "/v2/auth/password-reset-request",
            new { Email = user.Email },
            ct
        );
        Assert.Equal(HttpStatusCode.NoContent, requested.StatusCode);
        Assert.Empty(app.Transport.Messages);
        await app.Dispatch(ct);
        var mail = Assert.Single(app.Transport.Messages);
        Assert.Equal(user.Email, mail.Payload.Recipient);
        var query = QueryHelpers.ParseQuery(Link(mail.Payload.Body, "reset-password").Query);
        const string replacement = "ReplacementPassword2!";

        using var invalid = await client.PostAsJsonAsync(
            "/v2/auth/password-reset",
            new
            {
                EmailBase64 = query["emailBase64"].ToString(),
                ResetCode = "aW52YWxpZA",
                Password = replacement,
                PasswordConfirm = replacement,
            },
            ct
        );
        Assert.Equal(HttpStatusCode.Unauthorized, invalid.StatusCode);
        await app.InDatabase(async db =>
        {
            var stored = await db.Users.SingleAsync(ct);
            Assert.Equal(passwordHash, stored.PasswordHash);
            Assert.Equal(refreshHash, stored.RefreshToken);
        });

        var reset = new
        {
            EmailBase64 = query["emailBase64"].ToString(),
            ResetCode = query["resetCode"].ToString(),
            Password = replacement,
            PasswordConfirm = replacement,
        };
        using var changed = await client.PostAsJsonAsync("/v2/auth/password-reset", reset, ct);
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
            original.Cookie
        );
        Assert.Equal(HttpStatusCode.Unauthorized, refresh.StatusCode);
        using var oldLogin = await client.PostAsJsonAsync(
            "/v2/auth/login",
            new { Email = user.Email, Password = TestUsers.Password },
            ct
        );
        Assert.Equal(HttpStatusCode.Unauthorized, oldLogin.StatusCode);
        using var newLogin = await client.PostAsJsonAsync(
            "/v2/auth/login",
            new { Email = user.Email, Password = replacement },
            ct
        );
        Assert.Equal(HttpStatusCode.OK, newLogin.StatusCode);
        string? replacementHash = null;
        await app.InDatabase(async db =>
            replacementHash = (await db.Users.SingleAsync(ct)).RefreshToken
        );

        using var replay = await client.PostAsJsonAsync("/v2/auth/password-reset", reset, ct);
        Assert.Equal(HttpStatusCode.Unauthorized, replay.StatusCode);
        await app.InDatabase(async db =>
        {
            Assert.Equal(replacementHash, (await db.Users.SingleAsync(ct)).RefreshToken);
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        Assert.Single(app.Transport.Messages);
    }

    internal static Uri Link(string html, string route)
    {
        var match = Regex.Match(
            html,
            @"https://tests\.invalid/" + Regex.Escape(route) + @"\?[^""'<>\s]+",
            RegexOptions.CultureInvariant,
            TimeSpan.FromSeconds(1)
        );
        Assert.True(match.Success, "Expected action link was not present in captured email.");
        return new Uri(WebUtility.HtmlDecode(match.Value));
    }
}
