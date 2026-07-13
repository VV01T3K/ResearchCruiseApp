namespace ResearchCruiseApp.Domain.Entities;

public class FormA : Entity
{
    public Guid CruiseManagerId { get; set; }

    public Guid DeputyManagerId { get; set; }
    public string Year { get; init; } = null!;
    public string? AcceptablePeriodBeg { get; init; }
    public string? AcceptablePeriodEnd { get; init; }
    public string? OptimalPeriodBeg { get; init; }
    public string? OptimalPeriodEnd { get; init; }
    public string? PeriodSelectionType { get; init; }

    public DateTime? PrecisePeriodStart { get; init; }
    public DateTime? PrecisePeriodEnd { get; init; }
    public string CruiseHours { get; init; } = null!;
    public string PeriodNotes { get; init; } = null!;
    public string? ShipUsage { get; init; }
    public string DifferentUsage { get; init; } = null!;

    public List<Permission> Permissions { get; init; } = [];

    public List<ResearchAreaDescription> ResearchAreaDescriptions { get; init; } = [];
    public string? CruiseGoal { get; init; }
    public string CruiseGoalDescription { get; init; } = null!;

    public List<FormAResearchTask> FormAResearchTasks { get; init; } = [];

    public List<FormAContract> FormAContracts { get; init; } = [];

    public List<FormAUgUnit> FormAUgUnits { get; init; } = [];
    public string UgUnitsPoints { get; set; } = "0";

    public List<FormAGuestUnit> FormAGuestUnits { get; init; } = [];

    public List<FormAPublication> FormAPublications { get; init; } = [];

    public List<FormASpubTask> FormASpubTasks { get; init; } = [];
    public string SupervisorEmail { get; init; } = null!;
}
