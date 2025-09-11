using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp.Domain.Entities;

public class FormA : Entity
{
    public Guid CruiseManagerId { get; set; }

    public Guid DeputyManagerId { get; set; }

    [StringLength(1024)]
    public string Year { get; init; } = null!;

    [StringLength(1024)]
    public string? AcceptablePeriodBeg { get; init; }

    [StringLength(1024)]
    public string? AcceptablePeriodEnd { get; init; }

    [StringLength(1024)]
    public string? OptimalPeriodBeg { get; init; }

    [StringLength(1024)]
    public string? OptimalPeriodEnd { get; init; }

    public DateTime? PrecisePeriodStart { get; init; }
    public DateTime? PrecisePeriodEnd { get; init; }

    [StringLength(1024)]
    public string CruiseHours { get; init; } = null!;

    [StringLength(1024)]
    public string PeriodNotes { get; init; } = null!;

    [StringLength(1024)]
    public string? ShipUsage { get; init; }

    [StringLength(1024)]
    public string DifferentUsage { get; init; } = null!;

    public List<Permission> Permissions { get; init; } = [];

    public ResearchArea? ResearchArea { get; set; }

    [StringLength(10240)]
    public string? ResearchAreaInfo { get; init; }

    [StringLength(10240)]
    public string? CruiseGoal { get; init; }

    [StringLength(10240)]
    public string CruiseGoalDescription { get; init; } = null!;

    public List<FormAResearchTask> FormAResearchTasks { get; init; } = [];

    public List<FormAContract> FormAContracts { get; init; } = [];

    public List<FormAUgUnit> FormAUgUnits { get; init; } = [];

    [StringLength(1024)]
    public string UgUnitsPoints { get; set; } = "0";

    public List<FormAGuestUnit> FormAGuestUnits { get; init; } = [];

    public List<FormAPublication> FormAPublications { get; init; } = [];

    public List<FormASpubTask> FormASpubTasks { get; init; } = [];

    [StringLength(1024)]
    public string SupervisorEmail { get; init; } = null!;
}
