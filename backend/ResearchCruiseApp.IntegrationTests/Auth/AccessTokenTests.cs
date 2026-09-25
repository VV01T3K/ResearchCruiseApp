using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Auth;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class AccessTokenTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    // BE-AUTH-006: real bearer middleware rejects each independently invalid credential.
    [Theory]
    [InlineData("issuer")]
    [InlineData("audience")]
    [InlineData("signature")]
    [InlineData("expired")]
    [InlineData("malformed")]
    [InlineData("missing")]
    public async Task GetProfile_WhenAccessCredentialIsInvalid_ReturnsUnauthorizedWithoutChanges(
        string defect
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var user = await TestUsers.Create(app, "access@example.invalid", RoleName.Guest);
        using var client = app.CreateApiClient();
        var valid = await RefreshSessionTests.Login(client, user.Email!);
        using var control = new HttpRequestMessage(HttpMethod.Get, "/v2/users/me");
        control.Headers.Authorization = new AuthenticationHeaderValue("Bearer", valid.Access);
        using var controlResponse = await client.SendAsync(control, ct);
        Assert.Equal(HttpStatusCode.OK, controlResponse.StatusCode);
        string? storedHash = null;
        await app.InDatabase(async db =>
            storedHash = (await db.Users.SingleAsync(ct)).RefreshToken
        );

        var signingKey =
            defect == "signature"
                ? "DifferentSyntheticSigningKeyWithAtLeastThirtyTwoBytes!"
                : "SyntheticTestSigningKeyWithAtLeastThirtyTwoBytes!";
        var token = new JwtSecurityToken(
            issuer: defect == "issuer" ? "https://wrong-issuer.invalid" : "https://tests.invalid",
            audience: defect == "audience"
                ? "https://wrong-audience.invalid"
                : "https://tests.invalid",
            claims:
            [
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Role, RoleName.Guest),
            ],
            notBefore: new DateTime(2000, 1, 1, 0, 0, 0, DateTimeKind.Utc),
            expires: new DateTime(
                defect == "expired" ? 2001 : 2099,
                1,
                1,
                0,
                0,
                0,
                DateTimeKind.Utc
            ),
            signingCredentials: new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(signingKey)),
                SecurityAlgorithms.HmacSha256
            )
        );
        using var request = new HttpRequestMessage(HttpMethod.Get, "/v2/users/me");
        if (defect != "missing")
            request.Headers.Authorization = new AuthenticationHeaderValue(
                "Bearer",
                defect == "malformed"
                    ? "not.a.jwt"
                    : new JwtSecurityTokenHandler().WriteToken(token)
            );

        using var response = await client.SendAsync(request, ct);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        Assert.Contains(response.Headers.WwwAuthenticate, header => header.Scheme == "Bearer");
        Assert.False(response.Headers.Contains("Set-Cookie"));
        await app.InDatabase(async db =>
        {
            var stored = Assert.Single(await db.Users.ToListAsync(ct));
            Assert.Equal(user.Id, stored.Id);
            Assert.Equal(storedHash, stored.RefreshToken);
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
        Assert.Empty(app.Transport.Messages);
    }
}
