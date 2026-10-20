using System.Net;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Cruises;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Cruises;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class CruiseNumberTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

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
        var year = DateTime.Now.Year;
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
            Assert.Equal(
                autoPlan ? HttpStatusCode.NoContent : HttpStatusCode.Created,
                other.StatusCode
            );
        await app.InDatabase(async db =>
            Assert.Equal(
                [$"{year}/1", $"{year}/2"],
                (await db.Cruises.ToListAsync(ct)).Select(cruise => cruise.Number).Order()
            )
        );
    }
}
