using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResearchCruiseApp_API.Domain.Entities;


public class FormA
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }

    public Guid CruiseManagerId { get; set; }

    public Guid DeputyManagerId { get; set; }

    public string Year { get; set; } = null!;
  
    public string AcceptablePeriodBeg { get; set; }
    
    public string AcceptablePeriodEnd { get; set; }
    
    public string OptimalPeriodBeg { get; set; }
    
    public string OptimalPeriodEnd { get; set; }
    
    public string CruiseHours { get; set; }

    [StringLength(1024)]
    public string? PeriodNotes { get; set; }
    
    public int ShipUsage { get; set; }

    [StringLength(1024)]
    public string? DifferentUsage { get; set; }
    
    public int PermissionsRequired { get; set; }
    
    [StringLength(1024)]
    public string? Permissions { get; set; }
    
    public Guid ResearchAreaId { get; set; } 
    
    [MaxLength(1024)]
    public string? ResearchAreaInfo { get; set; }
    
    public int CruiseGoal { get; set; }
    
    [MaxLength(1024)]
    public string? CruiseGoalDescription { get; set; }

    public List<ResearchTask> ResearchTasks { get; set; } = [];

    public List<Contract> Contracts { get; set; } = [];

    public List<UgTeam> UgTeams { get; set; } = [];

    public List<GuestTeam> GuestTeams { get; set; } = [];

    public List<Publication> Publications { get; set; } = [];

    public List<Thesis> Theses { get; set; } = [];

    public List<SpubTask> SpubTasks { get; set; } = [];
}