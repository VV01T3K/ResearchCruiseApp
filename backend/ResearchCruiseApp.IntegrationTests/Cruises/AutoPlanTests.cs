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
    public async Task AutoPlan_PersistsOneNumberedCruisePerUnassignedAcceptedApplication()
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
        var assigned = Application(managerId, CruiseApplicationStatus.Accepted, "4");
        await app.InDatabase(async db =>
        {
            db.CruiseApplications.Add(Application(managerId, CruiseApplicationStatus.Draft, "4"));
            db.Cruises.Add(
                new Cruise
                {
                    Number = $"{year}/3",
                    StartDate = "2030-03-01T08:00:00.000Z",
                    EndDate = "2030-03-02T08:00:00.000Z",
                    Status = CruiseStatus.New,
                    CruiseApplications = [assigned],
                }
            );
            await db.SaveChangesAsync(ct);
        });

        using (var none = await client.PostAsync("/v2/cruises/auto-plan", null, ct))
            Assert.Equal(HttpStatusCode.NoContent, none.StatusCode);
        await app.InDatabase(async db =>
            Assert.Equal($"{year}/3", Assert.Single(await db.Cruises.ToListAsync(ct)).Number)
        );

        var eligible = new[]
        {
            Application(managerId, CruiseApplicationStatus.Accepted, "6"),
            Application(managerId, CruiseApplicationStatus.Accepted, "9"),
        };
        await app.InDatabase(async db =>
        {
            db.CruiseApplications.AddRange(eligible);
            await db.SaveChangesAsync(ct);
        });

        using (var planned = await client.PostAsync("/v2/cruises/auto-plan", null, ct))
            Assert.Equal(HttpStatusCode.NoContent, planned.StatusCode);
        using (var replanned = await client.PostAsync("/v2/cruises/auto-plan", null, ct))
            Assert.Equal(HttpStatusCode.NoContent, replanned.StatusCode);

        await app.InDatabase(async db =>
        {
            var cruises = await db
                .Cruises.Include(cruise => cruise.CruiseApplications)
                .ToListAsync(ct);
            Assert.Equal(3, cruises.Count);
            Assert.Equal(
                [$"{year}/3", $"{year}/4", $"{year}/5"],
                cruises.Select(cruise => cruise.Number).Order()
            );
            Assert.Equal(
                assigned.Id,
                Assert.Single(cruises.Single(c => c.Number == $"{year}/3").CruiseApplications).Id
            );
            var generated = cruises.Where(cruise => cruise.Number != $"{year}/3").ToList();
            Assert.All(generated, cruise => Assert.Equal(CruiseStatus.New, cruise.Status));
            Assert.All(generated, cruise => Assert.Equal(managerId, cruise.MainCruiseManagerId));
            Assert.Equal(
                eligible.Select(application => application.Id).Order(),
                generated.Select(cruise => Assert.Single(cruise.CruiseApplications).Id).Order()
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
