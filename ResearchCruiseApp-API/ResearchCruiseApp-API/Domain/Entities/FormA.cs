using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp_API.Domain.Entities;


public class FormA : Entity
{
    public Guid CruiseManagerId { get; init; }

    public Guid DeputyManagerId { get; init; }
    
    public int Year { get; init; }
  
    public int AcceptablePeriodBeg { get; init; }
    
    public int AcceptablePeriodEnd { get; init; }
    
    public int OptimalPeriodBeg { get; init; }
    
    public int OptimalPeriodEnd { get; init; }
    
    public int CruiseHours { get; init; }

    [StringLength(1024)]
    public string? PeriodNotes { get; init; }
    
    public int ShipUsage { get; init; }

    [StringLength(1024)]
    public string? DifferentUsage { get; init; }

    public List<Permission> Permissions { get; init; } = [];
    
    public int ResearchArea { get; init; } 
    
    [MaxLength(1024)]
    public string? ResearchAreaInfo { get; init; }
    
    public int CruiseGoal { get; init; }
    
    [MaxLength(1024)]
    public string? CruiseGoalDescription { get; init; }

    public List<FormAResearchTask> FormAResearchTasks { get; init; } = [];

    public List<FormAContract> FormAContracts { get; init; } = [];

    public List<FormAUgUnit> FormAUgUnits { get; init; } = [];

    public int UgUnitsPoints { get; set; }
    
    public List<FormAGuestUnit> FormAGuestUnits { get; init; } = [];

    public List<FormAPublication> FormAPublications { get; init; } = [];
    
    public List<FormASpubTask> FormASpubTasks { get; init; } = [];
}