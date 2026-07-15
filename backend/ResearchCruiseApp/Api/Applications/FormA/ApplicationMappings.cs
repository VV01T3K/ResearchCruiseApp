using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Shared;

internal static partial class ApplicationMappings
{
    public static FormA ToFormA(FormAFields dto)
    {
        return new FormA
        {
            Year = dto.Year,
            AcceptablePeriodBeg = dto.AcceptablePeriod is { Count: 2 }
                ? dto.AcceptablePeriod[0]
                : null,
            AcceptablePeriodEnd = dto.AcceptablePeriod is { Count: 2 }
                ? dto.AcceptablePeriod[1]
                : null,
            OptimalPeriodBeg = dto.OptimalPeriod is { Count: 2 } ? dto.OptimalPeriod[0] : null,
            OptimalPeriodEnd = dto.OptimalPeriod is { Count: 2 } ? dto.OptimalPeriod[1] : null,
            PeriodSelectionType = dto.PeriodSelectionType,
            PrecisePeriodStart = dto.PrecisePeriodStart,
            PrecisePeriodEnd = dto.PrecisePeriodEnd,
            CruiseHours = dto.CruiseHours,
            PeriodNotes = dto.PeriodNotes,
            ShipUsage = dto.ShipUsage,
            DifferentUsage = dto.DifferentUsage,
            CruiseGoal = dto.CruiseGoal,
            CruiseGoalDescription = dto.CruiseGoalDescription,
            SupervisorEmail = dto.SupervisorEmail,
        };
    }

    public static FormAFields ToFormAFields(FormA form)
    {
        return new FormAFields
        {
            Id = form.Id,
            CruiseManagerId = form.CruiseManagerId,
            DeputyManagerId = form.DeputyManagerId == Guid.Empty ? null : form.DeputyManagerId,
            Year = form.Year,
            AcceptablePeriod =
                form.AcceptablePeriodBeg is not null && form.AcceptablePeriodEnd is not null
                    ? [form.AcceptablePeriodBeg, form.AcceptablePeriodEnd]
                    : null,
            OptimalPeriod =
                form.OptimalPeriodBeg is not null && form.OptimalPeriodEnd is not null
                    ? [form.OptimalPeriodBeg, form.OptimalPeriodEnd]
                    : null,
            PeriodSelectionType = form.PeriodSelectionType,
            PrecisePeriodStart = form.PrecisePeriodStart,
            PrecisePeriodEnd = form.PrecisePeriodEnd,
            CruiseHours = form.CruiseHours,
            PeriodNotes = form.PeriodNotes,
            ShipUsage = form.ShipUsage,
            DifferentUsage = form.DifferentUsage,
            ResearchAreaDescriptions = form
                .ResearchAreaDescriptions.Select(ToResearchAreaSelection)
                .ToList(),
            ResearchTasks = form.FormAResearchTasks.Select(ToResearchTaskFields).ToList(),
            UgTeams = form.FormAUgUnits.Select(ToUgTeamFields).ToList(),
            GuestTeams = form.FormAGuestUnits.Select(ToGuestTeamFields).ToList(),
            Publications = form.FormAPublications.Select(ToPublicationFields).ToList(),
            SpubTasks = form.FormASpubTasks.Select(ToSpubTaskFields).ToList(),
            CruiseGoal = form.CruiseGoal,
            CruiseGoalDescription = form.CruiseGoalDescription,
            SupervisorEmail = form.SupervisorEmail,
        };
    }

    public static ScoredResearchTask ToScoredResearchTask(FormAResearchTask task) =>
        new()
        {
            Id = task.Id,
            ResearchTask = ToResearchTaskFields(task.ResearchTask),
            Points = task.Points.ToString(),
        };

    public static ScoredPublication ToScoredPublication(FormAPublication publication) =>
        new()
        {
            Id = publication.Id,
            Publication = ToPublicationFields(publication.Publication),
            Points = publication.Points.ToString(),
        };

    public static ScoredSpubTask ToScoredSpubTask(FormASpubTask task) =>
        new()
        {
            Id = task.Id,
            SpubTask = ToSpubTaskFields(task.SpubTask),
            Points = task.Points.ToString(),
        };
}
