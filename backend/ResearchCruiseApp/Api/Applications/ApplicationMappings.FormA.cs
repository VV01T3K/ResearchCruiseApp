using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications;

internal static partial class ApplicationMappings
{
    public static FormA ToFormA(FormADto dto)
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

    public static FormADto ToFormADto(FormA form)
    {
        return new FormADto
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
                .ResearchAreaDescriptions.Select(ToResearchAreaDescriptionDto)
                .ToList(),
            ResearchTasks = form.FormAResearchTasks.Select(ToResearchTaskDto).ToList(),
            UgTeams = form.FormAUgUnits.Select(ToUgTeamDto).ToList(),
            GuestTeams = form.FormAGuestUnits.Select(ToGuestTeamDto).ToList(),
            Publications = form.FormAPublications.Select(ToPublicationDto).ToList(),
            SpubTasks = form.FormASpubTasks.Select(ToSpubTaskDto).ToList(),
            CruiseGoal = form.CruiseGoal,
            CruiseGoalDescription = form.CruiseGoalDescription,
            SupervisorEmail = form.SupervisorEmail,
        };
    }

    public static FormAResearchTaskDto ToFormAResearchTaskDto(FormAResearchTask task) =>
        new()
        {
            Id = task.Id,
            ResearchTask = ToResearchTaskDto(task.ResearchTask),
            Points = task.Points.ToString(),
        };

    public static FormAPublicationDto ToFormAPublicationDto(FormAPublication publication) =>
        new()
        {
            Id = publication.Id,
            Publication = ToPublicationDto(publication.Publication),
            Points = publication.Points.ToString(),
        };

    public static FormASpubTaskDto ToFormASpubTaskDto(FormASpubTask task) =>
        new()
        {
            Id = task.Id,
            SpubTask = ToSpubTaskDto(task.SpubTask),
            Points = task.Points.ToString(),
        };
}
