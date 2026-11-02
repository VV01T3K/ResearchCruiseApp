using System.Collections.Concurrent;
using System.Globalization;
using ResearchCruiseApp.Api;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Api.Cruises;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Infrastructure.Identity.Contracts;

namespace ResearchCruiseApp.Api.Applications;

internal class ApplicationReader(
    ApplicationScoringService evaluator,
    IdentityService identityService,
    ContractReader contracts,
    ILogger<ApplicationReader> logger
)
{
    private static readonly ConcurrentDictionary<Guid, byte> ReportedApplications = new();

    private static readonly string[] StoredCruiseDateFormats =
    [
        "yyyy-MM-ddTHH:mm:ss.FFFFFFFK",
        "yyyy-MM-dd HH:mm:ss.FFFFFFF",
        "yyyy-MM-dd",
    ];

    public Task<Dictionary<Guid, CruiseManagerOptionDto>> LoadManagers(
        IEnumerable<CruiseApplication> applications,
        CancellationToken cancellationToken
    ) =>
        identityService.GetCruiseManagerOptionsByIds(
            applications
                .Where(application => application.FormA is not null)
                .SelectMany(application =>
                    new[] { application.FormA!.CruiseManagerId, application.FormA.DeputyManagerId }
                ),
            cancellationToken
        );

    public CruiseApplicationSummary Create(
        CruiseApplication application,
        IReadOnlyDictionary<Guid, CruiseManagerOptionDto> managers
    )
    {
        var form = application.FormA;
        var cruise = application.Cruise;
        var hasValidAcceptablePeriod = HasValidPeriod(
            form?.AcceptablePeriodBeg,
            form?.AcceptablePeriodEnd
        );
        var hasValidOptimalPeriod = HasValidPeriod(form?.OptimalPeriodBeg, form?.OptimalPeriodEnd);
        var year = ReadYear(form);
        var hasValidCruiseDates =
            TryReadCruiseDate(cruise?.StartDate, out var startDate)
            & TryReadCruiseDate(cruise?.EndDate, out var endDate);
        var invalidValues = new (bool IsValid, string Label)[]
        {
            (year is not null, "rok rejsu"),
            (hasValidCruiseDates, "data rejsu"),
            (hasValidAcceptablePeriod && hasValidOptimalPeriod, "okres rejsu"),
            (
                form is null
                    || form.FormAResearchTasks.All(task =>
                        HasValidAmount(task.ResearchTask.FinancingAmount)
                    ),
                "kwota finansowania"
            ),
        }
            .Where(value => !value.IsValid)
            .Select(value => value.Label)
            .ToList();
        if (invalidValues.Count > 0)
            LogInvalidValues(application, invalidValues);

        var dto = new CruiseApplicationSummary
        {
            Id = application.Id,
            Number = application.Number.ToString(CultureInfo.InvariantCulture),
            Date = application.Date,
            Year = year,
            CruiseManagerId = application.FormA?.CruiseManagerId ?? Guid.Empty,
            DeputyManagerId = application.FormA?.DeputyManagerId ?? Guid.Empty,
            HasFormA = application.FormA is not null,
            HasFormB = application.FormB is not null,
            HasFormC = application.FormC is not null,
            Status = application.Status,
            Note = application.Note,
            CruiseHours = application.FormA?.CruiseHours,
            AcceptablePeriodBeg = hasValidAcceptablePeriod ? form?.AcceptablePeriodBeg : null,
            AcceptablePeriodEnd = hasValidAcceptablePeriod ? form?.AcceptablePeriodEnd : null,
            OptimalPeriodBeg = hasValidOptimalPeriod ? form?.OptimalPeriodBeg : null,
            OptimalPeriodEnd = hasValidOptimalPeriod ? form?.OptimalPeriodEnd : null,
            PrecisePeriodStart = application.FormA?.PrecisePeriodStart,
            PrecisePeriodEnd = application.FormA?.PrecisePeriodEnd,
            StartDate = startDate,
            EndDate = endDate,
            InvalidStoredValues = invalidValues,
            Revision = application.RowVersion.ToRevision(),
        };

        AddManagers(application, dto, managers);
        dto.Points = evaluator.GetPointsSum(application);
        AddEffectsDoneRate(application, dto);
        AddCruiseDays(dto);

        return dto;
    }

    public CruiseApplicationCandidateResponse CreateCandidate(
        CruiseApplication application,
        IReadOnlyDictionary<Guid, CruiseManagerOptionDto> managers
    )
    {
        var manager = application.FormA?.CruiseManagerId is { } managerId
            ? managers.GetValueOrDefault(managerId)
            : null;
        var year = ReadYear(application.FormA);
        if (year is null)
            LogInvalidValues(application, ["rok rejsu"]);

        return new CruiseApplicationCandidateResponse
        {
            Id = application.Id,
            Number = application.Number.ToString(CultureInfo.InvariantCulture),
            Year = year,
            CruiseManagerId = application.FormA?.CruiseManagerId ?? Guid.Empty,
            DeputyManagerId = application.FormA?.DeputyManagerId ?? Guid.Empty,
            HasFormA = application.FormA is not null,
            HasFormB = application.FormB is not null,
            HasFormC = application.FormC is not null,
            CruiseManagerFirstName = manager?.FirstName ?? string.Empty,
            CruiseManagerLastName = manager?.LastName ?? string.Empty,
            Points = evaluator.GetPointsSum(application),
            CruiseId = application.Cruise?.Id,
            CruiseNumber = application.Cruise?.Number,
        };
    }

    public async Task<CruiseApplicationEvaluation> CreateEvaluationDetails(
        CruiseApplication application
    )
    {
        var form = application.FormA;
        return new CruiseApplicationEvaluation
        {
            FormAResearchTasks =
                form?.FormAResearchTasks.Select(ApplicationMappings.ToScoredResearchTask).ToList()
                ?? [],
            FormAContracts = await CreateContracts(form),
            UgTeams = form?.FormAUgUnits.Select(ApplicationMappings.ToNamedUgTeam).ToList() ?? [],
            GuestTeams =
                form?.FormAGuestUnits.Select(ApplicationMappings.ToGuestTeamFields).ToList() ?? [],
            UgUnitsPoints = form?.UgUnitsPoints ?? "0",
            FormAPublications =
                form?.FormAPublications.Select(ApplicationMappings.ToScoredPublication).ToList()
                ?? [],
            FormASpubTasks =
                form?.FormASpubTasks.Select(ApplicationMappings.ToScoredSpubTask).ToList() ?? [],
            EffectsPoints = application.EffectsPoints.ToString(CultureInfo.InvariantCulture),
        };
    }

    private void LogInvalidValues(CruiseApplication application, List<string> invalidValues)
    {
        if (ReportedApplications.TryAdd(application.Id, 0))
            logger.LogError(
                "Application {ApplicationId} has invalid stored values: {InvalidValues}",
                application.Id,
                invalidValues
            );
    }

    private static int? ReadYear(FormA? form) =>
        form is null ? 0
        : PlanningEndpoints.TryParseYear(form.Year, out var year) ? year
        : null;

    private static bool TryReadCruiseDate(string? stored, out DateTime? date)
    {
        date = null;
        if (string.IsNullOrEmpty(stored))
            return true;

        if (
            !DateTime.TryParseExact(
                stored,
                StoredCruiseDateFormats,
                CultureInfo.InvariantCulture,
                DateTimeStyles.RoundtripKind,
                out var parsed
            )
        )
            return false;

        date = parsed;
        return true;
    }

    private static bool HasValidPeriod(string? start, string? end) =>
        string.IsNullOrEmpty(start) && string.IsNullOrEmpty(end)
        || PlanningEndpoints.TryParsePeriodEdge(start, out var startEdge)
            && PlanningEndpoints.TryParsePeriodEdge(end, out var endEdge)
            && startEdge <= endEdge;

    private static bool HasValidAmount(string? amount) =>
        string.IsNullOrEmpty(amount)
        || decimal.TryParse(
            amount,
            NumberStyles.AllowDecimalPoint,
            CultureInfo.InvariantCulture,
            out _
        );

    private static void AddManagers(
        CruiseApplication application,
        CruiseApplicationSummary dto,
        IReadOnlyDictionary<Guid, CruiseManagerOptionDto> managers
    )
    {
        if (application.FormA?.CruiseManagerId is { } managerId)
        {
            var manager = managers.GetValueOrDefault(managerId);
            dto.CruiseManagerEmail = manager?.Email ?? string.Empty;
            dto.CruiseManagerFirstName = manager?.FirstName ?? string.Empty;
            dto.CruiseManagerLastName = manager?.LastName ?? string.Empty;
        }

        if (application.FormA?.DeputyManagerId is { } deputyId)
        {
            var deputy = managers.GetValueOrDefault(deputyId);
            dto.DeputyManagerEmail = deputy?.Email ?? string.Empty;
            dto.DeputyManagerFirstName = deputy?.FirstName ?? string.Empty;
            dto.DeputyManagerLastName = deputy?.LastName ?? string.Empty;
        }
    }

    private static void AddEffectsDoneRate(
        CruiseApplication application,
        CruiseApplicationSummary dto
    )
    {
        if (application.FormC is null || application.FormC.ResearchTaskEffects.Count == 0)
            return;

        var effects = application.FormC.ResearchTaskEffects;
        var doneEffects = effects.Count(effect => effect.Done.ToBool());
        dto.EffectsDoneRate = $"{100 * (float)doneEffects / effects.Count:f2}%";
    }

    private static void AddCruiseDays(CruiseApplicationSummary dto)
    {
        if (string.IsNullOrEmpty(dto.CruiseHours))
        {
            dto.CruiseDays = null;
            return;
        }

        if (int.TryParse(dto.CruiseHours, out var hours))
        {
            var days = hours / 24f;
            dto.CruiseDays = days > 0 ? days : null;
        }
    }

    private async Task<List<ScoredContract>> CreateContracts(FormA? form)
    {
        if (form is null)
            return [];

        var result = new List<ScoredContract>();
        foreach (var contract in form.FormAContracts)
        {
            result.Add(await contracts.Create(contract));
        }

        return result;
    }
}
