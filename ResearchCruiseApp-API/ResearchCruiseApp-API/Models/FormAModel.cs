using System.ComponentModel.DataAnnotations;
using ResearchCruiseApp_API.Models.DataTypes;

namespace ResearchCruiseApp_API.Models;

public class FormAModel
{
    [RegularExpression(@"^[0-9A-Fa-f]{8}-([0-9A-Fa-f]{4}-){3}[0-9A-Fa-f]{12}$")]
    public Guid? Id { get; set; }

    [RegularExpression(@"^[0-9A-Fa-f]{8}-([0-9A-Fa-f]{4}-){3}[0-9A-Fa-f]{12}$")]
    public Guid CruiseManagerId { get; set; }
    
    [RegularExpression(@"^[0-9A-Fa-f]{8}-([0-9A-Fa-f]{4}-){3}[0-9A-Fa-f]{12}$")]
    public Guid DeputyManagerId { get; set; }
    
    [Range(2024, 2050)]
    public int Year { get; set; }
    
    [Length(2,2)]
    public HashSet<int> AcceptablePeriod { get; set; } = [];
    
    [Length(2,2)]
    public HashSet<int> OptimalPeriod { get; set; } = [];
    
    [Range(0, int.MaxValue)]
    public int CruiseHours { get; set; }

    [Range(0, double.MaxValue)]
    public double? CruiseDays { get; set; }
    
    [StringLength(1024)]
    public string? PeriodNotes { get; set; }
    
    [Range(0,4)]
    public int ShipUsage { get; set; }
    
    [MaxLength(1024)]
    public string? DifferentUsage { get; set; }
    
    public int PermissionsRequired { get; set; }
    
    [MaxLength(1024)]
    public string? Permissions { get; set; }
    
    [Range(0,20)]
    public int ResearchArea { get; set; }
    
    [MaxLength(1024)]
    public string? ResearchAreaInfo { get; set; }
    
    public int CruiseGoal { get; set; }
    
    [MaxLength(1024)]
    public string? CruiseGoalDescription { get; set; }

    public List<ResearchTask> ResearchTasks { get; set; } = [];

    public List<Contract> Contracts { get; set; } = [];

    public List<UGTeam> UgTeams { get; set; } = [];

    public List<GuestTeam> GuestTeams { get; set; } = [];

    public List<Publication> Publications { get; set; } = [];

    public List<Thesis> Theses { get; set; } = [];

    public List<SPUBTask> SpubTasks { get; set; } = [];
}