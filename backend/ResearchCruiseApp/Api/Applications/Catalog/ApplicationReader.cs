using ResearchCruiseApp.Api;
using ResearchCruiseApp.Api.Applications.Shared;
using ResearchCruiseApp.Domain;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications;

internal class ApplicationReader(
    ApplicationScoringService evaluator,
    IdentityService identityService,
    ContractReader contracts
)
{
    public async Task<CruiseApplicationSummary> Create(CruiseApplication application)
    {
        var dto = new CruiseApplicationSummary
        {
            Id = application.Id,
            Number = application.Number.ToString(),
            Date = application.Date,
            Year = application.FormA is null ? default : int.Parse(application.FormA.Year),
            CruiseManagerId = application.FormA?.CruiseManagerId ?? Guid.Empty,
            DeputyManagerId = application.FormA?.DeputyManagerId ?? Guid.Empty,
            HasFormA = application.FormA is not null,
            HasFormB = application.FormB is not null,
            HasFormC = application.FormC is not null,
            Status = application.Status,
            Note = application.Note,
            CruiseHours = application.FormA?.CruiseHours,
            AcceptablePeriodBeg = application.FormA?.AcceptablePeriodBeg,
            AcceptablePeriodEnd = application.FormA?.AcceptablePeriodEnd,
            OptimalPeriodBeg = application.FormA?.OptimalPeriodBeg,
            OptimalPeriodEnd = application.FormA?.OptimalPeriodEnd,
            PrecisePeriodStart = application.FormA?.PrecisePeriodStart,
            PrecisePeriodEnd = application.FormA?.PrecisePeriodEnd,
            StartDate =
                application.Cruise is not null
                && !string.IsNullOrEmpty(application.Cruise.StartDate)
                    ? DateTime.Parse(application.Cruise.StartDate)
                    : null,
            EndDate =
                application.Cruise is not null && !string.IsNullOrEmpty(application.Cruise.EndDate)
                    ? DateTime.Parse(application.Cruise.EndDate)
                    : null,
        };

        await AddManagers(application, dto);
        dto.Points = evaluator.GetPointsSum(application);
        AddEffectsDoneRate(application, dto);
        AddCruiseDays(dto);

        return dto;
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
            EffectsPoints = application.EffectsPoints.ToString(),
        };
    }

    private async Task AddManagers(CruiseApplication application, CruiseApplicationSummary dto)
    {
        if (application.FormA?.CruiseManagerId is { } managerId)
        {
            var manager = await identityService.GetUserDtoById(managerId);
            dto.CruiseManagerEmail = manager?.Email ?? string.Empty;
            dto.CruiseManagerFirstName = manager?.FirstName ?? string.Empty;
            dto.CruiseManagerLastName = manager?.LastName ?? string.Empty;
        }

        if (application.FormA?.DeputyManagerId is { } deputyId)
        {
            var deputy = await identityService.GetUserDtoById(deputyId);
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
        if (application.FormC is null)
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
