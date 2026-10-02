using System.Net;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Auth;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class RejectedLoginTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    // BE-AUTH-002: failed authentication must not create a refresh session.
    [Theory]
    [InlineData("wrong-password")]
    [InlineData("unknown-account")]
    [InlineData("unaccepted")]
    [InlineData("unconfirmed")]
    public async Task Login_WhenCredentialsOrAccountAreIneligible_DeniesWithoutSessionOrEmail(
        string reason
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var user = await TestUsers.Create(app, "rejected@example.invalid");
        await app.InDatabase(async db =>
        {
            var stored = await db.Users.SingleAsync(row => row.Id == user.Id, ct);
            stored.Accepted = reason != "unaccepted";
            stored.EmailConfirmed = reason != "unconfirmed";
            await db.SaveChangesAsync(ct);
        });
        using var client = app.CreateApiClient();

        using var response = await client.PostAsJsonAsync(
            "/v2/auth/login",
            new
            {
                Email = reason == "unknown-account" ? "unknown@example.invalid" : user.Email,
                Password = reason == "wrong-password" ? "IncorrectPassword1!" : TestUsers.Password,
            },
            ct
        );

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        Assert.False(response.Headers.Contains("Set-Cookie"));
        await app.InDatabase(async db =>
        {
            var stored = Assert.Single(await db.Users.ToListAsync(ct));
            Assert.Equal(user.Id, stored.Id);
            Assert.Equal(reason != "unaccepted", stored.Accepted);
            Assert.Equal(reason != "unconfirmed", stored.EmailConfirmed);
            Assert.Null(stored.RefreshToken);
            Assert.Null(stored.RefreshTokenExpiry);
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        Assert.Empty(app.Transport.Messages);
    }
}
