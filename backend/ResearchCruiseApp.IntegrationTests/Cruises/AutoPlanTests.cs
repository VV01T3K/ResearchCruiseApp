using System.Net;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.IntegrationTests.Infrastructure;

namespace ResearchCruiseApp.IntegrationTests.Cruises;

[Collection(SqlTestCollectionDefinition.Name)]
public sealed class AutoPlanTests(SqlFixture fixture) : IAsyncLifetime
{
    public async ValueTask InitializeAsync() => await fixture.ResetAsync();

    public async ValueTask DisposeAsync() => await fixture.ResetAsync();

    [Fact]
    public async Task AutoPlan_PersistsOneNumberedCruisePerAcceptedApplication()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var year = DateTime.Now.Year;
        var manager = await TestUsers.Create(
            app,
            "manager@example.invalid",
            RoleName.CruiseManager
        );
        var office = await TestUsers.Create(app, "office@example.invalid", RoleName.Administrator);
        using var client = await TestApplications.Login(app, office.Email!);
        var managerId = Guid.Parse(manager.Id);
        var applications = new[]
        {
            Application(managerId, CruiseApplicationStatus.Accepted, "6"),
            Application(managerId, CruiseApplicationStatus.Accepted, "9"),
        };
        await app.InDatabase(async db =>
        {
            db.CruiseApplications.AddRange(applications);
            await db.SaveChangesAsync(ct);
        });

        using var response = await client.PostAsync("/v2/cruises/auto-plan", null, ct);

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        await app.InDatabase(async db =>
        {
            var cruises = await db
                .Cruises.Include(cruise => cruise.CruiseApplications)
                .ToListAsync(ct);
            Assert.Equal([$"{year}/1", $"{year}/2"], cruises.Select(c => c.Number).Order());
            Assert.Equal(
                applications.Select(application => application.Id).Order(),
                cruises.Select(cruise => Assert.Single(cruise.CruiseApplications).Id).Order()
            );
        });
    }

    internal static CruiseApplication Application(
        Guid managerId,
        CruiseApplicationStatus status,
        string optimalPeriodBeg
    ) =>
        new()
        {
            Date = new DateOnly(2030, 1, 15),
            Status = status,
            FormA = new FormA
            {
                CruiseManagerId = managerId,
                Year = "2030",
                OptimalPeriodBeg = optimalPeriodBeg,
                OptimalPeriodEnd = optimalPeriodBeg,
                CruiseHours = "24",
                PeriodNotes = "",
                DifferentUsage = "",
                CruiseGoalDescription = "",
                SupervisorEmail = "supervisor@example.invalid",
            },
        };
}
