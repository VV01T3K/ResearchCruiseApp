using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ResearchCruiseApp_API.Infrastructure.Services.Identity;

namespace ResearchCruiseApp_API.Domain.Entities;


public class FormA
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }

    public User CruiseManager { get; set; } = null!;

    public User DeputyManager { get; set; } = null!;
    
    public int Year { get; set; }
  
    public int AcceptablePeriodBeg { get; set; }
    
    public int AcceptablePeriodEnd { get; set; }
    
    public int OptimalPeriodBeg { get; set; }
    
    public int OptimalPeriodEnd { get; set; }
    
    public int CruiseHours { get; set; }

    [StringLength(1024)]
    public string? PeriodNotes { get; set; }
    
    public int ShipUsage { get; set; }

    [StringLength(1024)]
    public string? DifferentUsage { get; set; }
    
    public int PermissionsRequired { get; set; }
    
    [StringLength(1024)]
    public string? Permissions { get; set; }
    
    public int ResearchArea { get; set; } 
    
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