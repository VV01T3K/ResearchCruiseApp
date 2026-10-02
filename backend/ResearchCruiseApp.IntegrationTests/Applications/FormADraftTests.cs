using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Api.Auth;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Identity;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Applications;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class FormADraftTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    // BE-FORMA-001
    [Fact]
    public async Task Create_WhenManagerSavesIncompleteDraft_ReadsPersistedFormAndChildren()
    {
        var cancellationToken = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var user = await TestUsers.Create(
            app,
            "form-manager@example.invalid",
            RoleName.CruiseManager
        );
        using var client = await CreateAuthorizedClient(app, user.Email!, cancellationToken);
        var unit = new UgUnit { Name = "Synthetic faculty", IsActive = true };
        await app.InDatabase(async db =>
        {
            db.UgUnits.Add(unit);
            await db.SaveChangesAsync(cancellationToken);
        });
        var form = new FormAFields
        {
            CruiseManagerId = Guid.Parse(user.Id),
            Year = "2030",
            CruiseHours = "0",
            PeriodNotes = "",
            DifferentUsage = "",
            CruiseGoalDescription = "",
            SupervisorEmail = "",
            Note = "Foundation draft",
            UgTeams =
            [
                new UgTeamFields
                {
                    UgUnitId = unit.Id,
                    NoOfEmployees = "2",
                    NoOfStudents = "0",
                },
            ],
        };

        using var created = await client.PostAsJsonAsync(
            "/v2/applications",
            new FormAWriteRequest { Form = form, Draft = true },
            cancellationToken
        );

        Assert.Equal(HttpStatusCode.Created, created.StatusCode);
        Guid applicationId = default;
        await app.InDatabase(async db =>
        {
            var stored = Assert.Single(
                await db.CruiseApplications.Include(row => row.FormA).ToListAsync(cancellationToken)
            );
            applicationId = stored.Id;
            Assert.Equal(CruiseApplicationStatus.Draft, stored.Status);
            Assert.Equal("Foundation draft", stored.Note);
            Assert.Equal(Guid.Parse(user.Id), stored.FormA!.CruiseManagerId);
            Assert.Single(await db.FormsA.ToListAsync(cancellationToken));
            Assert.Single(await db.FormAUgUnits.ToListAsync(cancellationToken));
            Assert.Empty(await db.EmailOutboxMessages.ToListAsync(cancellationToken));
        });
        using var response = await client.GetAsync(
            $"/v2/applications/{applicationId}/form-a",
            cancellationToken
        );
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var read = await response.Content.ReadFromJsonAsync<FormAFields>(cancellationToken);
        Assert.NotNull(read);
        Assert.Equal(Guid.Parse(user.Id), read.CruiseManagerId);
        Assert.Equal("2030", read.Year);
        var team = Assert.Single(read.UgTeams);
        Assert.Equal(unit.Id, team.UgUnitId);
        Assert.Equal("2", team.NoOfEmployees);
        Assert.Equal("0", team.NoOfStudents);
        Assert.Empty(app.Transport.Messages);
    }

    // BE-FORMA-002
    [Fact]
    public async Task Create_WhenRequiredFormIsMissing_RejectsWithoutBusinessOrEmailWrites()
    {
        var cancellationToken = TestContext.Current.CancellationToken;
        await using (var app = new TestApplication(fixture.ConnectionString))
        {
            var user = await TestUsers.Create(
                app,
                "rejected@example.invalid",
                RoleName.CruiseManager
            );
            using var client = await CreateAuthorizedClient(app, user.Email!, cancellationToken);

            using var response = await client.PostAsJsonAsync(
                "/v2/applications",
                new { draft = true },
                cancellationToken
            );

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            await app.InDatabase(async db =>
            {
                Assert.Empty(await db.CruiseApplications.ToListAsync(cancellationToken));
                Assert.Empty(await db.FormsA.ToListAsync(cancellationToken));
                Assert.Empty(await db.FormAUgUnits.ToListAsync(cancellationToken));
                Assert.Empty(await db.EmailOutboxMessages.ToListAsync(cancellationToken));
            });
            Assert.Empty(app.Transport.Messages);
        }

        await fixture.ResetAsync();
        await using var clean = fixture.CreateDbContext();
        Assert.Empty(await clean.Users.ToListAsync(cancellationToken));
        Assert.Empty(await clean.CruiseApplications.ToListAsync(cancellationToken));
        Assert.Empty(await clean.EmailOutboxMessages.ToListAsync(cancellationToken));
    }

    private static async Task<HttpClient> CreateAuthorizedClient(
        TestApplication app,
        string email,
        CancellationToken cancellationToken
    )
    {
        var client = app.CreateApiClient();
        try
        {
            using var response = await client.PostAsJsonAsync(
                "/v2/auth/login",
                new LoginRequest(email, TestUsers.Password),
                cancellationToken
            );
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var tokens = await response.Content.ReadFromJsonAsync<TokenResponse>(cancellationToken);
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
                "Bearer",
                tokens!.AccessToken
            );
            return client;
        }
        catch
        {
            client.Dispose();
            throw;
        }
    }
}
