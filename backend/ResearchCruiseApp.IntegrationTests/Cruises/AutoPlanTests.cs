using System.Globalization;
using System.Net;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Cruises;
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
        var year = app.Clock.GetUtcNow().Year;
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

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
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

    [Theory]
    [InlineData(5, 31, 22, 6, 29, 22)]
    [InlineData(6, 1, 0, 6, 2, 0)]
    [InlineData(6, 1, 0, 6, 2, 0, "10:00", "13:00", "2030-06-01T08:00:00.000Z")]
    [InlineData(6, 1, 0, 6, 2, 0, "10:00", "12:30", null)]
    public async Task AutoPlan_ReadsPrecisePeriodAsPolishDays(
        int startMonth,
        int startDay,
        int startHour,
        int endMonth,
        int endDay,
        int endHour,
        string? startTime = null,
        string? endTime = null,
        string? expectedStart = "2030-06-01T06:00:00.000Z"
    )
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var manager = await TestUsers.Create(
            app,
            "manager@example.invalid",
            RoleName.CruiseManager
        );
        var office = await TestUsers.Create(app, "office@example.invalid", RoleName.Administrator);
        using var client = await TestApplications.Login(app, office.Email!);
        await app.InDatabase(async db =>
        {
            db.CruiseApplications.Add(
                Precise(
                    Guid.Parse(manager.Id),
                    new DateTime(2030, startMonth, startDay, startHour, 0, 0),
                    new DateTime(2030, endMonth, endDay, endHour, 0, 0),
                    startTime is null
                        ? null
                        : TimeOnly.Parse(startTime, CultureInfo.InvariantCulture),
                    endTime is null ? null : TimeOnly.Parse(endTime, CultureInfo.InvariantCulture)
                )
            );
            await db.SaveChangesAsync(ct);
        });

        using var response = await client.PostAsync("/v2/cruises/auto-plan", null, ct);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        await app.InDatabase(async db =>
            Assert.Equal(expectedStart, (await db.Cruises.SingleOrDefaultAsync(ct))?.StartDate)
        );
    }

    [Fact]
    public async Task AutoPlan_UsesCruiseHoursAndSkipsOccupiedTime()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var manager = await TestUsers.Create(
            app,
            "manager@example.invalid",
            RoleName.CruiseManager
        );
        var office = await TestUsers.Create(app, "office@example.invalid", RoleName.Administrator);
        using var client = await TestApplications.Login(app, office.Email!);
        var managerId = Guid.Parse(manager.Id);
        var june = Precise(managerId, new DateTime(2030, 6, 1), new DateTime(2030, 6, 30));
        var juneAgain = Precise(managerId, new DateTime(2030, 6, 1), new DateTime(2030, 6, 30));
        var touching = Precise(managerId, new DateTime(2030, 7, 1), new DateTime(2030, 7, 30));
        var overlapping = Precise(managerId, new DateTime(2030, 8, 1), new DateTime(2030, 8, 30));
        var blocked = Precise(managerId, new DateTime(2030, 9, 1), new DateTime(2030, 9, 30));
        await app.InDatabase(async db =>
        {
            foreach (var application in new[] { june, juneAgain, touching, overlapping, blocked })
            {
                db.CruiseApplications.Add(application);
                await db.SaveChangesAsync(ct);
            }
            db.Cruises.AddRange(
                Existing("2029/1", "2030-06-30T06:00:00.000Z", "2030-07-01T06:00:00.000Z"),
                Existing("2029/2", "2030-08-01T10:00:00.000Z", "2030-08-03T10:00:00.000Z"),
                Existing("2029/3", "2030-08-31T00:00:00.000Z", "2030-09-05T00:00:00.000Z", true),
                Existing("2029/4", "2030-06-01T10:00:00.000Z", "2030-06-01T10:00:00.000Z"),
                Existing("2029/5", "not-a-date", "also-not-a-date", status: CruiseStatus.Ended)
            );
            await db.SaveChangesAsync(ct);
        });

        using var response = await client.PostAsync("/v2/cruises/auto-plan", null, ct);
        using var repeated = await client.PostAsync("/v2/cruises/auto-plan", null, ct);

        var result = await response.Content.ReadFromJsonAsync<AutoPlanResponse>(ct);
        Assert.Equal(2, result!.PlannedCount);
        Assert.Equal(
            [juneAgain.Id, overlapping.Id, blocked.Id],
            result.Skipped.Select(skipped => skipped.ApplicationId)
        );
        Assert.Equal(
            0,
            (await repeated.Content.ReadFromJsonAsync<AutoPlanResponse>(ct))!.PlannedCount
        );
        await app.InDatabase(async db =>
        {
            var planned = await db
                .Cruises.Where(cruise => cruise.CruiseApplications.Any())
                .Select(cruise => new
                {
                    cruise.CruiseApplications[0].Id,
                    cruise.StartDate,
                    cruise.EndDate,
                })
                .ToListAsync(ct);
            Assert.Equal(
                [
                    new
                    {
                        june.Id,
                        StartDate = "2030-06-01T06:00:00.000Z",
                        EndDate = "2030-06-02T09:00:00.000Z",
                    },
                    new
                    {
                        touching.Id,
                        StartDate = "2030-07-01T06:00:00.000Z",
                        EndDate = "2030-07-02T09:00:00.000Z",
                    },
                ],
                planned.OrderBy(cruise => cruise.StartDate)
            );
        });
    }

    [Fact]
    public async Task AutoPlan_SkipsCandidatesWhenAStoredCruiseHasMalformedDates()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var manager = await TestUsers.Create(
            app,
            "manager@example.invalid",
            RoleName.CruiseManager
        );
        var office = await TestUsers.Create(app, "office@example.invalid", RoleName.Administrator);
        using var client = await TestApplications.Login(app, office.Email!);
        var candidate = Precise(
            Guid.Parse(manager.Id),
            new DateTime(2030, 6, 1),
            new DateTime(2030, 6, 30)
        );
        await app.InDatabase(async db =>
        {
            db.CruiseApplications.Add(candidate);
            db.Cruises.Add(Existing("2029/1", "not-a-date", "also-not-a-date"));
            await db.SaveChangesAsync(ct);
        });

        using var created = await client.PostAsJsonAsync(
            "/v2/cruises",
            new CreateRequest("not-a-date", "2030-07-02", Guid.Empty, Guid.Empty, [], null, false),
            ct
        );
        using var response = await client.PostAsync("/v2/cruises/auto-plan", null, ct);

        Assert.Equal(HttpStatusCode.BadRequest, created.StatusCode);
        var result = await response.Content.ReadFromJsonAsync<AutoPlanResponse>(ct);
        Assert.Equal(0, result!.PlannedCount);
        Assert.Equal([candidate.Id], result.Skipped.Select(skipped => skipped.ApplicationId));
    }

    [Fact]
    public async Task Blockades_IncludeBlockadesSpanningTheWholeYear()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var app = new TestApplication(fixture.ConnectionString);
        var office = await TestUsers.Create(app, "office@example.invalid", RoleName.Administrator);
        using var client = await TestApplications.Login(app, office.Email!);
        await app.InDatabase(async db =>
        {
            db.Cruises.Add(
                Existing("2029/1", "2030-12-01T00:00:00.000Z", "2032-01-15T00:00:00.000Z", true)
            );
            await db.SaveChangesAsync(ct);
        });

        var blockades = await client.GetFromJsonAsync<List<BlockadeResponse>>(
            "/v2/cruises/blockades?year=2031",
            ct
        );

        Assert.Single(blockades!);
    }

    internal static Cruise Existing(
        string number,
        string start,
        string end,
        bool blockade = false,
        CruiseStatus status = CruiseStatus.New
    ) =>
        new()
        {
            Number = number,
            StartDate = start,
            EndDate = end,
            Status = status,
            ShipUnavailable = blockade,
            CruiseApplications = [],
        };

    private static CruiseApplication Precise(
        Guid managerId,
        DateTime start,
        DateTime end,
        TimeOnly? startTime = null,
        TimeOnly? endTime = null
    ) =>
        Application(
            managerId,
            CruiseApplicationStatus.Accepted,
            null,
            (start, end),
            startTime,
            endTime
        );

    internal static CruiseApplication Application(
        Guid managerId,
        CruiseApplicationStatus status,
        string? optimalPeriodBeg,
        (DateTime Start, DateTime End)? precisePeriod = null,
        TimeOnly? startTime = null,
        TimeOnly? endTime = null
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
                OptimalPeriodEnd = optimalPeriodBeg is null
                    ? null
                    : $"{int.Parse(optimalPeriodBeg, CultureInfo.InvariantCulture) + 1}",
                PrecisePeriodStart = precisePeriod?.Start,
                PrecisePeriodEnd = precisePeriod?.End,
                PrecisePeriodStartTime = startTime,
                PrecisePeriodEndTime = endTime,
                CruiseHours = precisePeriod is null ? "24" : "27",
                PeriodNotes = "",
                DifferentUsage = "",
                CruiseGoalDescription = "",
                SupervisorEmail = "supervisor@example.invalid",
            },
        };
}
