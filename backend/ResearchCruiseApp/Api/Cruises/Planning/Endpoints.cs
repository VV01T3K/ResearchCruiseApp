using System.Globalization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Api.Cruises.Shared;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Persistence;
using DomainCruise = ResearchCruiseApp.Domain.Entities.Cruise;

namespace ResearchCruiseApp.Api.Cruises;

public static class PlanningEndpoints
{
    public static void Map(RouteGroupBuilder group)
    {
        MapAutoPlan(group);
        MapGetBlockades(group);
    }

    private static void MapAutoPlan(RouteGroupBuilder group)
    {
        group
            .MapPost("/auto-plan", AutoPlan)
            .WithName("AutoPlanCruises")
            .WithSummary("Automatically plan eligible cruises.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .WithSerializableTransaction()
            .RequireAuthorization(AuthorizationPolicies.AdministratorsOrShipowners);
    }

    private static void MapGetBlockades(RouteGroupBuilder group)
    {
        group
            .MapGet("/blockades", GetBlockades)
            .WithName("GetCruiseBlockades")
            .WithSummary("Get blockade periods for a year.")
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .RequireAuthorization(AuthorizationPolicies.AnyKnownUser);
    }

    private static async Task<Ok<AutoPlanResponse>> AutoPlan(
        YearBasedKeyGenerator yearBasedKeyGenerator,
        ApplicationDbContext dbContext,
        GlobalizationService globalizationService,
        CancellationToken cancellationToken
    )
    {
        await yearBasedKeyGenerator.Lock<DomainCruise>(cancellationToken);
        var applications = await dbContext
            .CruiseApplications.IncludeForms()
            .IncludeFormAContent()
            .ToListAsync(cancellationToken);
        var cruises = await dbContext
            .Cruises.IncludeCruiseApplications()
            .ToListAsync(cancellationToken);

        var timeZone = globalizationService.GetTimeZoneInfo();
        var occupied = cruises
            .Where(cruise =>
                cruise.Status != CruiseStatus.Ended
                || !cruise.ShipUnavailable && ParsePeriod(cruise) is not null
            )
            .Select(cruise =>
                ParsePeriod(cruise) is var (start, end)
                    ? (
                        Start: start,
                        End: end,
                        Reason: cruise.ShipUnavailable
                            ? "Termin koliduje z blokadą statku."
                            : "Termin koliduje z istniejącym rejsem."
                    )
                    : (
                        Start: DateTime.MinValue,
                        End: DateTime.MaxValue,
                        Reason: $"Rejs nr {cruise.Number} ma niepoprawny termin."
                    )
            )
            .ToList();
        var newCruises = new List<DomainCruise>();
        var skipped = new List<SkippedApplicationResponse>();
        foreach (
            var application in applications
                .Where(application =>
                    application.Status == CruiseApplicationStatus.Accepted
                    && !cruises.Any(cruise => cruise.CruiseApplications.Contains(application))
                )
                .OrderBy(application => application.Number)
        )
        {
            if (application.FormA is null)
            {
                skipped.Add(
                    SkippedApplicationResponse.From(application, "Zgłoszenie nie ma formularza A.")
                );
                continue;
            }

            var (start, end, windowEnd) = GetAutoCalculatedDates(application.FormA, timeZone);
            var reason =
                end > windowEnd
                    ? "Czas trwania rejsu nie mieści się w terminie zgłoszenia."
                    : occupied
                        .Where(interval =>
                            interval.Start < interval.End
                            && interval.Start < end
                            && start < interval.End
                        )
                        .Select(interval => interval.Reason)
                        .FirstOrDefault();
            if (reason is not null)
            {
                skipped.Add(SkippedApplicationResponse.From(application, reason));
                continue;
            }

            occupied.Add((start, end, "Termin koliduje z innym rejsem dodanym automatycznie."));
            newCruises.Add(
                new DomainCruise
                {
                    MainCruiseManagerId = application.FormA.CruiseManagerId,
                    MainDeputyManagerId = application.FormA.DeputyManagerId,
                    StartDate = start.ToString(
                        DateFormats.IsoStringDateFormat,
                        CultureInfo.InvariantCulture
                    ),
                    EndDate = end.ToString(
                        DateFormats.IsoStringDateFormat,
                        CultureInfo.InvariantCulture
                    ),
                    CruiseApplications = [application],
                }
            );
        }

        if (newCruises.Count > 0)
        {
            var numbers = await yearBasedKeyGenerator.GenerateKeys(
                dbContext.Cruises,
                newCruises.Count,
                cancellationToken
            );
            foreach (var (cruise, number) in newCruises.Zip(numbers))
            {
                cruise.Number = number;
                cruise.Status = CruiseStatus.New;
            }

            await dbContext.Cruises.AddRangeAsync(newCruises, cancellationToken);
        }

        return TypedResults.Ok(new AutoPlanResponse(newCruises.Count, skipped));
    }

    private static async Task<Ok<List<BlockadeResponse>>> GetBlockades(
        int year,
        ApplicationDbContext dbContext,
        CancellationToken cancellationToken
    )
    {
        var blockingCruises = await GetBlockingCruisesForYear(year, dbContext, cancellationToken);
        return TypedResults.Ok(blockingCruises.Select(BlockadeResponse.From).ToList());
    }

    private static async Task<List<DomainCruise>> GetBlockingCruisesForYear(
        int year,
        ApplicationDbContext dbContext,
        CancellationToken cancellationToken
    )
    {
        var cruises = await dbContext.Cruises.ToListAsync(cancellationToken);

        return cruises
            .Where(cruise =>
                cruise.ShipUnavailable
                && (cruise.Status == CruiseStatus.New || cruise.Status == CruiseStatus.Confirmed)
            )
            .Where(cruise =>
                ParsePeriod(cruise) is var (start, end)
                && start < new DateTime(year + 1, 1, 1)
                && end > new DateTime(year, 1, 1)
            )
            .ToList();
    }

    private static (DateTime Start, DateTime End, DateTime WindowEnd) GetAutoCalculatedDates(
        FormA formA,
        TimeZoneInfo timeZone
    )
    {
        var (windowStart, windowEnd) = formA
            is { PrecisePeriodStart: not null, PrecisePeriodEnd: not null }
            ? (formA.PrecisePeriodStart.Value.Date, formA.PrecisePeriodEnd.Value.Date)
            : (
                GetPeriodEdgeDate(formA.Year, formA.OptimalPeriodBeg!),
                GetPeriodEdgeDate(formA.Year, formA.OptimalPeriodEnd!)
            );
        var start = ToUtcAtEight(windowStart, timeZone);

        return (
            start,
            start.AddHours(int.Parse(formA.CruiseHours)),
            ToUtcAtEight(windowEnd, timeZone)
        );
    }

    private static DateTime GetPeriodEdgeDate(string year, string edge) =>
        new DateTime(int.Parse(year), 1, 1)
            .AddMonths(int.Parse(edge) / 2)
            .AddDays(int.Parse(edge) % 2 * 14);

    private static DateTime ToUtcAtEight(DateTime date, TimeZoneInfo timeZone) =>
        TimeZoneInfo.ConvertTimeToUtc(
            DateTime.SpecifyKind(date.AddHours(8), DateTimeKind.Unspecified),
            timeZone
        );

    private static (DateTime Start, DateTime End)? ParsePeriod(DomainCruise cruise) =>
        TryParseUtc(cruise.StartDate, out var start)
        && TryParseUtc(cruise.EndDate, out var end)
        && start <= end
            ? (start, end)
            : null;

    internal static bool TryParseUtc(string? date, out DateTime result) =>
        DateTime.TryParse(
            date,
            CultureInfo.InvariantCulture,
            DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal,
            out result
        );
}
