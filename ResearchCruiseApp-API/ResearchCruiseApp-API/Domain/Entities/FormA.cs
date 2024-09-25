using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp_API.Domain.Entities;

public class FormA : Entity
{
    public Guid CruiseManagerId { get; init; }

    public Guid DeputyManagerId { get; init; }

    [StringLength(1024)] 
    public string Year { get; init; } = null!;

    [StringLength(1024)]
    public string AcceptablePeriodBeg { get; init; } = null!;

    [StringLength(1024)] 
    public string AcceptablePeriodEnd { get; init; } = null!;

    [StringLength(1024)]
    public string OptimalPeriodBeg { get; init; } = null!;

    [StringLength(1024)]
    public string OptimalPeriodEnd { get; init; } = null!;

    [StringLength(1024)]
    public string CruiseHours { get; init; } = null!;

    [StringLength(1024)]
    public string? PeriodNotes { get; init; }

    [StringLength(1024)]
    public string ShipUsage { get; init; } = null!;

    [StringLength(1024)]
    public string? DifferentUsage { get; init; }
    
    public List<Permission> Permissions { get; init; } = [];

    [StringLength(1024)]
    public ResearchArea ResearchArea { get; set; } = null!;
    
    [MaxLength(1024)]
    public string? ResearchAreaInfo { get; init; }

    [StringLength(1024)]
    public string CruiseGoal { get; init; } = null!;
    
    [MaxLength(1024)]
    public string? CruiseGoalDescription { get; init; }

    public List<FormAResearchTask> FormAResearchTasks { get; init; } = [];

    public List<FormAContract> FormAContracts { get; init; } = [];

    public List<FormAUgUnit> FormAUgUnits { get; init; } = [];

    [StringLength(1024)]
    public string UgUnitsPoints { get; set; } = "0";
    
    public List<FormAGuestUnit> FormAGuestUnits { get; init; } = [];

    public List<FormAPublication> FormAPublications { get; init; } = [];
    
    public List<FormASpubTask> FormASpubTasks { get; init; } = [];
    
    [StringLength(1024)]
    public string SupervisorEmail { get; set; } = null!;
}