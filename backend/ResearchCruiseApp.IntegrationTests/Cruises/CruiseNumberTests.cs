using System.Net;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Api.Cruises;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.IntegrationTests.Applications;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Cruises;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class CruiseNumberTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    [Fact]
    public async Task NewYearInPoland_ApplicationDateNumberAndYearOptionsAgree()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        app.Clock.Advance(
            new DateTimeOffset(2030, 12, 31, 23, 30, 0, TimeSpan.Zero) - app.Clock.GetUtcNow()
        );
        var office = await TestUsers.Create(app, "office@example.invalid", RoleName.Administrator);
        using var client = await TestApplications.Login(app, office.Email!);

        using var application = await client.PostAsJsonAsync(
            "/v2/applications",
            new FormAWriteRequest
            {
                Form = FormAccessTests.Draft(Guid.Parse(office.Id)),
                Draft = true,
            },
            ct
        );
        using var cruise = await client.PostAsJsonAsync(
            "/v2/cruises",
            new CreateRequest("2031-06-01", "2031-06-02", Guid.Empty, Guid.Empty, [], "", false),
            ct
        );
        var options = await client.GetFromJsonAsync<FormAOptions>(
            "/v2/applications/form-a/context",
            ct
        );

        Assert.Equal(HttpStatusCode.Created, application.StatusCode);
        Assert.Equal(HttpStatusCode.Created, cruise.StatusCode);
        Assert.Equal(["2031", "2032"], options!.Years);
        await app.InDatabase(async db =>
        {
            Assert.Equal(
                new DateOnly(2031, 1, 1),
                (await db.CruiseApplications.SingleAsync(ct)).Date
            );
            Assert.Equal("2031/1", (await db.Cruises.SingleAsync(ct)).Number);
        });
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public async Task CreateCruise_WhileAnotherCreationIsSaving_BothGetConsecutiveNumbers(
        bool autoPlan
    )
    {
        var ct = TestContext.Current.CancellationToken;
        var gate = new SaveChangesGate();
        await using var app = new TestApplication(fixture.ConnectionString, interceptor: gate);
        var year = app.Clock.GetUtcNow().Year;
        var office = await TestUsers.Create(app, "office@example.invalid", RoleName.Administrator);
        using var client = await TestApplications.Login(app, office.Email!);
        if (autoPlan)
        {
            var manager = await TestUsers.Create(
                app,
                "manager@example.invalid",
                RoleName.CruiseManager
            );
            await app.InDatabase(async db =>
            {
                db.CruiseApplications.Add(
                    AutoPlanTests.Application(
                        Guid.Parse(manager.Id),
                        CruiseApplicationStatus.Accepted,
                        "6"
                    )
                );
                await db.SaveChangesAsync(ct);
            });
        }

        gate.Hold(db =>
            db.ChangeTracker.Entries<Cruise>().Any(entry => entry.State == EntityState.Added)
        );
        var (held, other) = await gate.Race(
            fixture.ConnectionString,
            client.PostAsJsonAsync(
                "/v2/cruises",
                new CreateRequest(
                    "2030-07-01",
                    "2030-07-02",
                    Guid.Empty,
                    Guid.Empty,
                    [],
                    "",
                    false
                ),
                ct
            ),
            () =>
                autoPlan
                    ? client.PostAsync("/v2/cruises/auto-plan", null, ct)
                    : client.PostAsJsonAsync(
                        "/v2/cruises",
                        new CreateRequest(
                            "2030-08-01",
                            "2030-08-02",
                            Guid.Empty,
                            Guid.Empty,
                            [],
                            "",
                            false
                        ),
                        ct
                    ),
            ct
        );

        using (held)
            Assert.Equal(HttpStatusCode.Created, held.StatusCode);
        using (other)
            Assert.Equal(autoPlan ? HttpStatusCode.OK : HttpStatusCode.Created, other.StatusCode);
        await app.InDatabase(async db =>
            Assert.Equal(
                [$"{year}/1", $"{year}/2"],
                (await db.Cruises.ToListAsync(ct)).Select(cruise => cruise.Number).Order()
            )
        );
    }
}
