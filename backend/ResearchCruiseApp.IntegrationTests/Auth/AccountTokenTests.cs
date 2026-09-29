using System.Buffers.Binary;
using System.Net;
using System.Net.Http.Json;
using System.Text;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Infrastructure.Identity;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Auth;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class AccountTokenTests(SqlFixture fixture) : IAsyncLifetime
{
    private const string ReplacementPassword = "ReplacementPassword2!";

    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    // BE-ACCOUNT-011: expired or corrupted protected email tokens leave the original usable.
    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public async Task Use_WhenTokenIsExpiredOrCorrupted_PreservesAccountAndSession(
        bool confirmation
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        using var client = app.CreateApiClient();
        var user = await CreateAccount(app, client, "target@example.invalid", confirmation);
        var other = await TestUsers.Create(app, "other@example.invalid", RoleName.CruiseManager);
        var cookie = confirmation
            ? null
            : (await RefreshSessionTests.Login(client, user.Email!)).Cookie;
        var original = await ReadAccount(app, user.Id);
        var otherOriginal = await ReadAccount(app, other.Id);
        var token = await RequestToken(app, client, user.Email!, confirmation);
        await AssertTokenValid(app, user.Id, token.Code, confirmation);
        var expired = WithCreationTime(
            app,
            token.Code,
            new DateTimeOffset(2000, 1, 1, 0, 0, 0, TimeSpan.Zero)
        );
        var corrupted = WebEncoders.Base64UrlDecode(token.Code);
        var protectedBytes = Convert.FromBase64String(Encoding.UTF8.GetString(corrupted));
        protectedBytes[^1] ^= 1;
        var corruptedCode = WebEncoders.Base64UrlEncode(
            Encoding.UTF8.GetBytes(Convert.ToBase64String(protectedBytes))
        );
        foreach (var rejectedCode in new[] { expired, corruptedCode })
        {
            using var rejected = await UseToken(
                client,
                confirmation,
                (rejectedCode, token.Identity)
            );
            Assert.Equal(HttpStatusCode.Unauthorized, rejected.StatusCode);
            Assert.False(rejected.Headers.Contains("Set-Cookie"));
            await AssertUnchanged(app, original);
            await AssertUnchanged(app, otherOriginal);
            Assert.Single(app.Transport.Messages);
        }
        using var valid = await UseToken(client, confirmation, token);
        Assert.Equal(HttpStatusCode.NoContent, valid.StatusCode);
        await AssertSuccessfulUse(app, original, confirmation);
        await AssertUnchanged(app, otherOriginal);
        if (!confirmation)
        {
            using var oldRefresh = await RefreshSessionTests.SendCookie(
                client,
                "/v2/auth/refresh",
                cookie!
            );
            Assert.Equal(HttpStatusCode.Unauthorized, oldRefresh.StatusCode);
            using var oldLogin = await client.PostAsJsonAsync(
                "/v2/auth/login",
                new { Email = user.Email, Password = TestUsers.Password },
                ct
            );
            Assert.Equal(HttpStatusCode.Unauthorized, oldLogin.StatusCode);
            using var newLogin = await client.PostAsJsonAsync(
                "/v2/auth/login",
                new { Email = user.Email, Password = ReplacementPassword },
                ct
            );
            Assert.Equal(HttpStatusCode.OK, newLogin.StatusCode);
        }
        else
        {
            using var awaitingAcceptance = await client.PostAsJsonAsync(
                "/v2/auth/login",
                new { Email = user.Email, Password = TestUsers.Password },
                ct
            );
            Assert.Equal(HttpStatusCode.Unauthorized, awaitingAcceptance.StatusCode);
        }
        Assert.Single(app.Transport.Messages);
    }

    // BE-ACCOUNT-012: a genuine token cannot confirm or reset another existing account.
    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public async Task Use_WhenTokenBelongsToAnotherUser_RejectsWithoutConsumingEitherToken(
        bool confirmation
    )
    {
        await using var app = new TestApplication(fixture.ConnectionString);
        using var client = app.CreateApiClient();
        var first = await CreateAccount(app, client, "first@example.invalid", confirmation);
        var second = await CreateAccount(app, client, "second@example.invalid", confirmation);
        if (!confirmation)
        {
            await RefreshSessionTests.Login(client, first.Email!);
            await RefreshSessionTests.Login(client, second.Email!);
        }
        var originalFirst = await ReadAccount(app, first.Id);
        var originalSecond = await ReadAccount(app, second.Id);
        var firstToken = await RequestToken(app, client, first.Email!, confirmation);
        var secondToken = await RequestToken(app, client, second.Email!, confirmation);
        using var wrongUser = await UseToken(
            client,
            confirmation,
            (firstToken.Code, secondToken.Identity)
        );
        Assert.Equal(HttpStatusCode.Unauthorized, wrongUser.StatusCode);
        await AssertUnchanged(app, originalFirst);
        await AssertUnchanged(app, originalSecond);
        using var correctSecond = await UseToken(client, confirmation, secondToken);
        Assert.Equal(HttpStatusCode.NoContent, correctSecond.StatusCode);
        await AssertSuccessfulUse(app, originalSecond, confirmation);
        await AssertUnchanged(app, originalFirst);
        using var correctFirst = await UseToken(client, confirmation, firstToken);
        Assert.Equal(HttpStatusCode.NoContent, correctFirst.StatusCode);
        await AssertSuccessfulUse(app, originalFirst, confirmation);
        Assert.Equal(2, app.Transport.Messages.Count);
    }

    // BE-ACCOUNT-013: reset/confirmation tokens share a protector, but their purposes differ.
    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public async Task Use_WhenTokenHasWrongPurpose_RejectsAndPreservesCorrectToken(
        bool confirmation
    )
    {
        await using var app = new TestApplication(fixture.ConnectionString);
        using var client = app.CreateApiClient();
        var user = await CreateAccount(app, client, "target@example.invalid", true);
        var original = await ReadAccount(app, user.Id);
        var confirm = await RequestToken(app, client, user.Email!, true);
        var reset = await RequestToken(app, client, user.Email!, false);
        var correct = confirmation ? confirm : reset;
        var wrong = confirmation ? reset : confirm;
        using var rejected = await UseToken(client, confirmation, (wrong.Code, correct.Identity));
        Assert.Equal(HttpStatusCode.Unauthorized, rejected.StatusCode);
        await AssertUnchanged(app, original);
        using var accepted = await UseToken(client, confirmation, correct);
        Assert.Equal(HttpStatusCode.NoContent, accepted.StatusCode);
        await AssertSuccessfulUse(app, original, confirmation);
        Assert.Equal(2, app.Transport.Messages.Count);
    }

    // BE-ACCOUNT-014: current confirmation replay is idempotent and preserves a live session.
    [Fact]
    public async Task Confirm_WhenLinkIsRepeated_PreservesAcceptedAccountAndRefreshSession()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        using var client = app.CreateApiClient();
        var user = await CreateAccount(app, client, "target@example.invalid", true);
        var admin = await TestUsers.Create(app, "office@example.invalid", RoleName.Administrator);
        var token = await RequestToken(app, client, user.Email!, true);
        using var first = await UseToken(client, true, token);
        Assert.Equal(HttpStatusCode.NoContent, first.StatusCode);
        using var office = await TestApplications.Login(app, admin.Email!);
        using var accepted = await office.PutAsync($"/v2/users/{user.Id}/acceptance", null, ct);
        Assert.Equal(HttpStatusCode.NoContent, accepted.StatusCode);
        await app.Dispatch(ct);
        Assert.Equal(2, app.Transport.Messages.Count);
        var session = await RefreshSessionTests.Login(client, user.Email!);
        var original = await ReadAccount(app, user.Id);
        var officeOriginal = await ReadAccount(app, admin.Id);
        for (var attempt = 0; attempt < 2; attempt++)
        {
            using var replay = await UseToken(client, true, token);
            Assert.Equal(HttpStatusCode.NoContent, replay.StatusCode);
            await AssertUnchanged(app, original);
            await AssertUnchanged(app, officeOriginal, RoleName.Administrator);
            Assert.Equal(2, app.Transport.Messages.Count);
        }
        using var refreshed = await RefreshSessionTests.SendCookie(
            client,
            "/v2/auth/refresh",
            session.Cookie
        );
        Assert.Equal(HttpStatusCode.OK, refreshed.StatusCode);
        Assert.Equal(2, app.Transport.Messages.Count);
    }

    // BE-ACCOUNT-015: changing the password invalidates a previously issued confirmation token.
    [Fact]
    public async Task Confirm_WhenPasswordResetChangesSecurityStamp_RejectsOldTokenAndAllowsResend()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        using var client = app.CreateApiClient();
        var user = await CreateAccount(app, client, "target@example.invalid", true);
        var confirm = await RequestToken(app, client, user.Email!, true);
        var reset = await RequestToken(app, client, user.Email!, false);
        using var changed = await UseToken(client, false, reset);
        Assert.Equal(HttpStatusCode.NoContent, changed.StatusCode);
        var original = await ReadAccount(app, user.Id);
        Assert.NotEqual(user.SecurityStamp, original.SecurityStamp);
        using var staleConfirmation = await UseToken(client, true, confirm);
        Assert.Equal(HttpStatusCode.Unauthorized, staleConfirmation.StatusCode);
        await AssertUnchanged(app, original);
        using var resetReplay = await UseToken(client, false, reset);
        Assert.Equal(HttpStatusCode.Unauthorized, resetReplay.StatusCode);
        await AssertUnchanged(app, original);
        using var resent = await client.PostAsJsonAsync(
            "/v2/auth/resend-confirmation-email",
            new { Email = user.Email },
            ct
        );
        Assert.Equal(HttpStatusCode.NoContent, resent.StatusCode);
        await app.Dispatch(ct);
        Assert.Equal(3, app.Transport.Messages.Count);
        var link = PasswordRecoveryTests.Link(
            app.Transport.Messages[^1].Payload.Body,
            "confirm-email"
        );
        var query = QueryHelpers.ParseQuery(link.Query);
        using var newConfirmation = await UseToken(
            client,
            true,
            (query["code"].ToString(), query["userId"].ToString())
        );
        Assert.Equal(HttpStatusCode.NoContent, newConfirmation.StatusCode);
        await AssertSuccessfulUse(app, original, true);
        Assert.Equal(3, app.Transport.Messages.Count);
    }

    private static async Task<User> CreateAccount(
        TestApplication app,
        HttpClient client,
        string email,
        bool confirmation
    )
    {
        var ct = TestContext.Current.CancellationToken;
        if (!confirmation)
            return await TestUsers.Create(app, email, RoleName.CruiseManager);
        await using (var scope = app.Services.CreateAsyncScope())
        {
            var roles = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            if (!await roles.RoleExistsAsync(RoleName.CruiseManager))
                Assert.True(
                    (await roles.CreateAsync(new IdentityRole(RoleName.CruiseManager))).Succeeded
                );
        }
        using var created = await client.PostAsJsonAsync(
            "/v2/auth/register",
            new
            {
                Email = email,
                Password = TestUsers.Password,
                FirstName = "New",
                LastName = "Researcher",
            },
            ct
        );
        Assert.Equal(HttpStatusCode.Created, created.StatusCode);
        User? user = null;
        await app.InDatabase(async db =>
            user = await db.Users.AsNoTracking().SingleAsync(row => row.Email == email, ct)
        );
        return user!;
    }

    private static async Task<(string Code, string Identity)> RequestToken(
        TestApplication app,
        HttpClient client,
        string email,
        bool confirmation
    )
    {
        var ct = TestContext.Current.CancellationToken;
        if (!confirmation)
        {
            using var requested = await client.PostAsJsonAsync(
                "/v2/auth/password-reset-request",
                new { Email = email },
                ct
            );
            Assert.Equal(HttpStatusCode.NoContent, requested.StatusCode);
        }
        await app.Dispatch(ct);
        var route = confirmation ? "confirm-email" : "reset-password";
        var mail = Assert.Single(
            app.Transport.Messages,
            mail =>
                mail.Payload.Recipient == email
                && mail.Payload.Body.Contains("/" + route + "?", StringComparison.Ordinal)
        );
        var query = QueryHelpers.ParseQuery(
            PasswordRecoveryTests.Link(mail.Payload.Body, route).Query
        );
        return (
            query[confirmation ? "code" : "resetCode"].ToString(),
            query[confirmation ? "userId" : "emailBase64"].ToString()
        );
    }

    private static Task<HttpResponseMessage> UseToken(
        HttpClient client,
        bool confirmation,
        (string Code, string Identity) token
    ) =>
        confirmation
            ? client.GetAsync(
                $"/v2/auth/confirm-email?userId={Uri.EscapeDataString(token.Identity)}&code={Uri.EscapeDataString(token.Code)}",
                TestContext.Current.CancellationToken
            )
            : client.PostAsJsonAsync(
                "/v2/auth/password-reset",
                new
                {
                    EmailBase64 = token.Identity,
                    ResetCode = token.Code,
                    Password = ReplacementPassword,
                    PasswordConfirm = ReplacementPassword,
                },
                TestContext.Current.CancellationToken
            );

    private static async Task AssertTokenValid(
        TestApplication app,
        string id,
        string code,
        bool confirmation
    )
    {
        await using var scope = app.Services.CreateAsyncScope();
        var manager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var user = await manager.FindByIdAsync(id);
        Assert.NotNull(user);
        var provider = confirmation
            ? manager.Options.Tokens.EmailConfirmationTokenProvider
            : manager.Options.Tokens.PasswordResetTokenProvider;
        var purpose = confirmation
            ? UserManager<User>.ConfirmEmailTokenPurpose
            : UserManager<User>.ResetPasswordTokenPurpose;
        Assert.True(
            await manager.VerifyUserTokenAsync(
                user,
                provider,
                purpose,
                Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(code))
            )
        );
    }

    private static string WithCreationTime(
        TestApplication app,
        string code,
        DateTimeOffset creationTime
    )
    {
        // ASP.NET Core 10.0.12 stores UTC ticks as the first Int64 of the protected payload.
        // https://github.com/dotnet/aspnetcore/blob/v10.0.12/src/Identity/Core/src/DataProtectorTokenProvider.cs
        var options = app
            .Services.GetRequiredService<IOptions<DataProtectionTokenProviderOptions>>()
            .Value;
        var protector = app
            .Services.GetRequiredService<IDataProtectionProvider>()
            .CreateProtector(options.Name);
        var payload = protector.Unprotect(
            Convert.FromBase64String(Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(code)))
        );
        Assert.True(payload.Length > sizeof(long));
        var remaining = payload.AsSpan(sizeof(long)).ToArray();
        BinaryPrimitives.WriteInt64LittleEndian(payload, creationTime.UtcTicks);
        Assert.Equal(remaining, payload.AsSpan(sizeof(long)).ToArray());
        Assert.True(creationTime + options.TokenLifespan < DateTimeOffset.UtcNow);
        return WebEncoders.Base64UrlEncode(
            Encoding.UTF8.GetBytes(Convert.ToBase64String(protector.Protect(payload)))
        );
    }

    private static async Task<User> ReadAccount(TestApplication app, string id)
    {
        User? user = null;
        await app.InDatabase(async db =>
            user = await db
                .Users.AsNoTracking()
                .SingleAsync(row => row.Id == id, TestContext.Current.CancellationToken)
        );
        return user!;
    }

    private static async Task AssertUnchanged(
        TestApplication app,
        User original,
        string role = RoleName.CruiseManager
    )
    {
        var stored = await ReadAccount(app, original.Id);
        Assert.Equal(original.Email, stored.Email);
        Assert.Equal(original.EmailConfirmed, stored.EmailConfirmed);
        Assert.Equal(original.Accepted, stored.Accepted);
        Assert.Equal(original.PasswordHash, stored.PasswordHash);
        Assert.Equal(original.SecurityStamp, stored.SecurityStamp);
        Assert.Equal(original.RefreshToken, stored.RefreshToken);
        Assert.Equal(original.RefreshTokenExpiry, stored.RefreshTokenExpiry);
        await AssertMembershipAndNoQueuedEmail(app, original.Id, role);
    }

    private static async Task AssertSuccessfulUse(
        TestApplication app,
        User original,
        bool confirmation
    )
    {
        var stored = await ReadAccount(app, original.Id);
        Assert.Equal(original.Email, stored.Email);
        Assert.Equal(confirmation || original.EmailConfirmed, stored.EmailConfirmed);
        Assert.Equal(original.Accepted, stored.Accepted);
        if (confirmation)
        {
            Assert.Equal(original.PasswordHash, stored.PasswordHash);
            Assert.Equal(original.SecurityStamp, stored.SecurityStamp);
            Assert.Equal(original.RefreshToken, stored.RefreshToken);
            Assert.Equal(original.RefreshTokenExpiry, stored.RefreshTokenExpiry);
        }
        else
        {
            Assert.NotEqual(original.PasswordHash, stored.PasswordHash);
            Assert.NotEqual(original.SecurityStamp, stored.SecurityStamp);
            Assert.Null(stored.RefreshToken);
            Assert.Null(stored.RefreshTokenExpiry);
        }
        await AssertMembershipAndNoQueuedEmail(app, original.Id);
    }

    private static async Task AssertMembershipAndNoQueuedEmail(
        TestApplication app,
        string id,
        string role = RoleName.CruiseManager
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await app.InDatabase(async db =>
        {
            var roleId = Assert
                .Single(await db.UserRoles.Where(row => row.UserId == id).ToListAsync(ct))
                .RoleId;
            Assert.Equal(role, (await db.Roles.SingleAsync(row => row.Id == roleId, ct)).Name);
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
    }
}
