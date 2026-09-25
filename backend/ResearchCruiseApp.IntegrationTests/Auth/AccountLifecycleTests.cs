using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Auth;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class AccountLifecycleTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    // BE-ACCOUNT-003: confirmation does not substitute for office acceptance; deactivation revokes refresh.
    [Fact]
    public async Task Account_WhenConfirmedAcceptedThenDeactivated_EnforcesBothGatesAndRevokesSession()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        await RegistrationTests.EnsureRegistrationRole(app);
        var admin = await TestUsers.Create(
            app,
            "administrator@example.invalid",
            RoleName.Administrator
        );
        using var client = app.CreateApiClient();
        const string email = "new-account@example.invalid";
        using var registered = await client.PostAsJsonAsync(
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
        Assert.Equal(HttpStatusCode.Created, registered.StatusCode);
        await app.Dispatch(ct);
        var confirmation = Assert.Single(app.Transport.Messages);
        Assert.Equal(email, confirmation.Payload.Recipient);
        var link = PasswordRecoveryTests.Link(confirmation.Payload.Body, "confirm-email");
        var query = QueryHelpers.ParseQuery(link.Query);
        var userId = query["userId"].ToString();

        using var invalid = await client.GetAsync(
            $"/v2/auth/confirm-email?userId={userId}&code=invalid",
            ct
        );
        Assert.Equal(HttpStatusCode.Unauthorized, invalid.StatusCode);
        await AssertAccount(app, userId, false, false, false);
        using var confirmed = await client.GetAsync("/v2/auth/confirm-email" + link.Query, ct);
        Assert.Equal(HttpStatusCode.NoContent, confirmed.StatusCode);
        await AssertAccount(app, userId, true, false, false);
        using var awaitingAcceptance = await client.PostAsJsonAsync(
            "/v2/auth/login",
            new { Email = email, Password = TestUsers.Password },
            ct
        );
        Assert.Equal(HttpStatusCode.Unauthorized, awaitingAcceptance.StatusCode);

        using var office = await TestApplications.Login(app, admin.Email!);
        using var accepted = await office.PutAsync($"/v2/users/{userId}/acceptance", null, ct);
        Assert.Equal(HttpStatusCode.NoContent, accepted.StatusCode);
        await AssertAccount(app, userId, true, true, false);
        await app.InDatabase(async db =>
            Assert.Single(await db.EmailOutboxMessages.ToListAsync(ct))
        );
        await app.Dispatch(ct);
        Assert.Equal(2, app.Transport.Messages.Count);
        Assert.Equal(email, app.Transport.Messages[1].Payload.Recipient);
        var session = await RefreshSessionTests.Login(client, email);
        await AssertAccount(app, userId, true, true, true);

        using var deactivated = await office.DeleteAsync($"/v2/users/{userId}/acceptance", ct);
        Assert.Equal(HttpStatusCode.NoContent, deactivated.StatusCode);
        await AssertAccount(app, userId, true, false, false);
        using var login = await client.PostAsJsonAsync(
            "/v2/auth/login",
            new { Email = email, Password = TestUsers.Password },
            ct
        );
        Assert.Equal(HttpStatusCode.Unauthorized, login.StatusCode);
        using var refresh = await RefreshSessionTests.SendCookie(
            client,
            "/v2/auth/refresh",
            session.Cookie
        );
        Assert.Equal(HttpStatusCode.Unauthorized, refresh.StatusCode);
        await app.InDatabase(async db =>
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct))
        );
        Assert.Equal(2, app.Transport.Messages.Count);
    }

    private static async Task AssertAccount(
        TestApplication app,
        string id,
        bool confirmed,
        bool accepted,
        bool hasSession
    )
    {
        await app.InDatabase(async db =>
        {
            var user = await db.Users.SingleAsync(
                row => row.Id == id,
                TestContext.Current.CancellationToken
            );
            Assert.Equal(confirmed, user.EmailConfirmed);
            Assert.Equal(accepted, user.Accepted);
            Assert.Equal(hasSession, user.RefreshToken is not null);
            Assert.Equal(hasSession, user.RefreshTokenExpiry is not null);
        });
    }
}
