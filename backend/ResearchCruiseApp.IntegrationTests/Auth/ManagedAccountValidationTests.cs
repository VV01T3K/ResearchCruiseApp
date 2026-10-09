using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Users;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Auth;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class ManagedAccountValidationTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    // BE-ACCOUNT-007: invalid email is rejected by both real managed-account routes.
    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public async Task Write_WhenEmailIsInvalid_ReturnsValidationErrorWithoutMutation(bool update)
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        await TestUsers.Create(app, "administrator@example.invalid", RoleName.Administrator);
        var target = await TestUsers.Create(app, "target@example.invalid", RoleName.Guest);
        using var targetClient = app.CreateApiClient();
        var session = await RefreshSessionTests.Login(targetClient, target.Email!);
        string? refresh = null;
        DateTime? refreshExpiry = null;
        await app.InDatabase(async db =>
        {
            var stored = await db.Users.SingleAsync(user => user.Id == target.Id, ct);
            refresh = stored.RefreshToken;
            refreshExpiry = stored.RefreshTokenExpiry;
        });
        using var client = await TestApplications.Login(app, "administrator@example.invalid");
        using var response = update
            ? await client.PatchAsJsonAsync(
                $"/v2/users/{target.Id}",
                new UpdateUserRequest("invalid", "Changed", "Names"),
                ct
            )
            : await client.PostAsJsonAsync(
                "/v2/users",
                new CreateUserRequest("invalid", "New", "Account", [RoleName.Guest]),
                ct
            );
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);
        using var problem = await JsonDocument.ParseAsync(
            await response.Content.ReadAsStreamAsync(ct),
            cancellationToken: ct
        );
        Assert.NotEmpty(
            problem.RootElement.GetProperty("errors").GetProperty("email").EnumerateArray()
        );
        await AssertTarget(
            app,
            target.Id,
            target.Email!,
            "Test",
            "Researcher",
            target.PasswordHash,
            refresh,
            refreshExpiry
        );
        using var read = await client.GetAsync("/v2/users", ct);
        Assert.Equal(HttpStatusCode.OK, read.StatusCode);
        var users = await read.Content.ReadFromJsonAsync<List<UserResponse>>(ct);
        Assert.Equal(2, users!.Count);
        var result = Assert.Single(users, user => user.Id.ToString() == target.Id);
        Assert.Equal(target.Email, result.Email);
        Assert.Equal("Test", result.FirstName);
        Assert.Equal("Researcher", result.LastName);
        using var refreshed = await RefreshSessionTests.SendCookie(
            targetClient,
            "/v2/auth/refresh",
            session.Cookie
        );
        Assert.Equal(HttpStatusCode.OK, refreshed.StatusCode);
        await app.Dispatch(ct);
        Assert.Empty(app.Transport.Messages);
    }

    // BE-ACCOUNT-008: null/omitted email and an empty update preserve credentials and membership.
    [Fact]
    public async Task Update_WhenEmailIsOmittedOrNull_PreservesEmailAndSessionWhileChangingNames()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        await TestUsers.Create(app, "administrator@example.invalid", RoleName.Administrator);
        var target = await TestUsers.Create(app, "target@example.invalid", RoleName.Guest);
        using var targetClient = app.CreateApiClient();
        var session = await RefreshSessionTests.Login(targetClient, target.Email!);
        string? refresh = null;
        DateTime? refreshExpiry = null;
        await app.InDatabase(async db =>
        {
            var stored = await db.Users.SingleAsync(user => user.Id == target.Id, ct);
            refresh = stored.RefreshToken;
            refreshExpiry = stored.RefreshTokenExpiry;
        });
        using var client = await TestApplications.Login(app, "administrator@example.invalid");
        var requests = new[]
        {
            (Body: "{}", FirstName: "Test", LastName: "Researcher"),
            (Body: "{\"firstName\":\"Renamed\"}", FirstName: "Renamed", LastName: "Researcher"),
            (
                Body: "{\"email\":null,\"lastName\":\"Updated\"}",
                FirstName: "Renamed",
                LastName: "Updated"
            ),
        };
        foreach (var request in requests)
        {
            using var content = new StringContent(
                request.Body,
                System.Text.Encoding.UTF8,
                "application/json"
            );
            using var response = await client.PatchAsync($"/v2/users/{target.Id}", content, ct);
            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
            await AssertTarget(
                app,
                target.Id,
                target.Email!,
                request.FirstName,
                request.LastName,
                target.PasswordHash,
                refresh,
                refreshExpiry
            );
            using var read = await client.GetAsync("/v2/users", ct);
            Assert.Equal(HttpStatusCode.OK, read.StatusCode);
            var users = await read.Content.ReadFromJsonAsync<List<UserResponse>>(ct);
            var result = Assert.Single(users!, user => user.Id.ToString() == target.Id);
            Assert.Equal(target.Email, result.Email);
            Assert.Equal(request.FirstName, result.FirstName);
            Assert.Equal(request.LastName, result.LastName);
            Assert.True(result.EmailConfirmed);
            Assert.True(result.Accepted);
            Assert.Equal([RoleName.Guest], result.Roles);
        }
        using var refreshed = await RefreshSessionTests.SendCookie(
            targetClient,
            "/v2/auth/refresh",
            session.Cookie
        );
        Assert.Equal(HttpStatusCode.OK, refreshed.StatusCode);
        await app.Dispatch(ct);
        Assert.Empty(app.Transport.Messages);
    }

    private static async Task AssertTarget(
        TestApplication app,
        string id,
        string email,
        string firstName,
        string lastName,
        string? passwordHash,
        string? refresh,
        DateTime? refreshExpiry
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await app.InDatabase(async db =>
        {
            Assert.Equal(2, await db.Users.CountAsync(ct));
            var user = await db.Users.SingleAsync(user => user.Id == id, ct);
            Assert.Equal(email, user.Email);
            Assert.Equal(firstName, user.FirstName);
            Assert.Equal(lastName, user.LastName);
            Assert.True(user.EmailConfirmed);
            Assert.True(user.Accepted);
            Assert.Equal(passwordHash, user.PasswordHash);
            Assert.Equal(refresh, user.RefreshToken);
            Assert.Equal(refreshExpiry, user.RefreshTokenExpiry);
            var membership = Assert.Single(
                await db.UserRoles.Where(role => role.UserId == id).ToListAsync(ct)
            );
            Assert.Equal(
                RoleName.Guest,
                (await db.Roles.SingleAsync(role => role.Id == membership.RoleId, ct)).Name
            );
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
        });
    }
}
