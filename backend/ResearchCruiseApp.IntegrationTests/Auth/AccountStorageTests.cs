using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Auth;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class AccountStorageTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    public static TheoryData<string, string, bool> Boundaries
    {
        get
        {
            var cases = new TheoryData<string, string, bool>();
            foreach (var route in new[] { "register", "create", "update" })
            foreach (var propertyName in new[] { "Email", "FirstName", "LastName" })
            foreach (var oversized in new[] { false, true })
                cases.Add(route, propertyName, oversized);
            return cases;
        }
    }

    // BE-ACCOUNT-018: Identity's email/name storage limits apply at all three HTTP boundaries.
    [Theory]
    [MemberData(nameof(Boundaries))]
    public async Task Write_WhenFieldReachesStorageBoundary_PersistsLimitAndRejectsOverflow(
        string operation,
        string field,
        bool oversized
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        if (operation == "register")
            await RegistrationTests.EnsureRegistrationRole(app);
        else
            await TestUsers.Create(app, "administrator@example.invalid", RoleName.Administrator);
        var target =
            operation == "register"
                ? null
                : await TestUsers.Create(app, "target@example.invalid", RoleName.Guest);
        using var client =
            operation == "register"
                ? app.CreateApiClient()
                : await TestApplications.Login(app, "administrator@example.invalid");
        var body = new Dictionary<string, object>
        {
            ["Email"] = operation == "update" ? target!.Email! : "boundary@example.invalid",
            ["FirstName"] = "Test",
            ["LastName"] = "Researcher",
            ["Password"] = TestUsers.Password,
            ["Roles"] = new[] { RoleName.Guest },
        };
        var limit = field == "Email" ? 256 : 1024;
        var length = limit + (oversized ? 1 : 0);
        var value =
            field == "Email"
                ? new string('a', length - "@example.invalid".Length) + "@example.invalid"
                : new string('Ł', length);
        body[field] = value;
        string? usersBefore = null;
        string? rolesBefore = null;
        await app.InDatabase(async db =>
        {
            usersBefore = JsonSerializer.Serialize(
                await db.Users.OrderBy(user => user.Id).ToListAsync(ct)
            );
            rolesBefore = JsonSerializer.Serialize(
                await db
                    .UserRoles.OrderBy(role => role.UserId)
                    .ThenBy(role => role.RoleId)
                    .ToListAsync(ct)
            );
        });
        using var response =
            operation == "update"
                ? await client.PatchAsJsonAsync($"/v2/users/{target!.Id}", body, ct)
                : await client.PostAsJsonAsync(
                    operation == "register" ? "/v2/auth/register" : "/v2/users",
                    body,
                    ct
                );
        Assert.Equal(
            oversized ? HttpStatusCode.BadRequest
                : operation == "update" ? HttpStatusCode.NoContent
                : HttpStatusCode.Created,
            response.StatusCode
        );
        if (oversized)
        {
            Assert.Equal(
                "application/problem+json",
                response.Content.Headers.ContentType?.MediaType
            );
            using var problem = JsonDocument.Parse(await response.Content.ReadAsStringAsync(ct));
            var error = Assert.Single(problem.RootElement.GetProperty("errors").EnumerateObject());
            Assert.Equal(JsonNamingPolicy.CamelCase.ConvertName(field), error.Name);
            Assert.NotEmpty(error.Value.EnumerateArray());
        }
        await app.InDatabase(async db =>
        {
            if (oversized)
            {
                Assert.Equal(
                    usersBefore,
                    JsonSerializer.Serialize(
                        await db.Users.OrderBy(user => user.Id).ToListAsync(ct)
                    )
                );
                Assert.Equal(
                    rolesBefore,
                    JsonSerializer.Serialize(
                        await db
                            .UserRoles.OrderBy(role => role.UserId)
                            .ThenBy(role => role.RoleId)
                            .ToListAsync(ct)
                    )
                );
                Assert.Empty(await db.EmailOutboxMessages.ToListAsync(ct));
                return;
            }
            Assert.Equal(
                operation == "register" ? 1
                    : operation == "create" ? 3
                    : 2,
                await db.Users.CountAsync(ct)
            );
            var saved = await db.Users.SingleAsync(user => user.Email == (string)body["Email"], ct);
            Assert.Equal(body["FirstName"], saved.FirstName);
            Assert.Equal(body["LastName"], saved.LastName);
            Assert.Equal(((string)body["Email"]).ToUpperInvariant(), saved.NormalizedEmail);
            if (operation == "update")
            {
                Assert.Equal(target!.Id, saved.Id);
                Assert.Equal(target.PasswordHash, saved.PasswordHash);
                Assert.Equal(target.SecurityStamp, saved.SecurityStamp);
                Assert.Equal(target.UserName, saved.UserName);
            }
            else
                Assert.Equal(body["Email"], saved.UserName);
            var membership = Assert.Single(
                await db.UserRoles.Where(role => role.UserId == saved.Id).ToListAsync(ct)
            );
            Assert.Equal(
                operation == "register" ? RoleName.CruiseManager : RoleName.Guest,
                (await db.Roles.SingleAsync(role => role.Id == membership.RoleId, ct)).Name
            );
            Assert.Equal(
                operation == "update" && field != "Email" ? 0 : 1,
                await db.EmailOutboxMessages.CountAsync(ct)
            );
        });
        await app.Dispatch(ct);
        Assert.Equal(
            oversized || operation == "update" && field != "Email" ? 0 : 1,
            app.Transport.Messages.Count
        );
    }
}
