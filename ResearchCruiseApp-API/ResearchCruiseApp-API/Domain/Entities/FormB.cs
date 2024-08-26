using System.ComponentModel.DataAnnotations.Schema;

namespace ResearchCruiseApp_API.Domain.Entities;


public class FormB
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    
    public Guid CruiseManagerId { get; set; }

    public Guid DeputyManagerId { get; set; }
    
    public int Year { get; set; }
  
    public int AcceptablePeriodBeg { get; set; }
    
    public int AcceptablePeriodEnd { get; set; }
    
    public int OptimalPeriodBeg { get; set; }
    
    public int OptimalPeriodEnd { get; set; }
    
    public int CruiseHours { get; set; }

    public string PeriodNotes { get; set; }
    
    public int ShipUsage { get; set; }
    
    private bool _permissionsRequired;
    public bool PermissionsRequired
    {
        get{return _permissionsRequired;}
        set
        {
            _permissionsRequired = value;
            if (!value)
            {
                Permissions = null;
            }
        }
    }
    
    public string? Permissions { get; set; }
    
    public List<int>  ResearchArea { get; set; } 
    
    public int CruiseGoal { get; set; }
    
    public string CruiseGoalDescription { get; set; }
    
    public List<ResearchTask> ResearchTasks { get; set; } 
    
    public List<Contract> Contracts { get; set; } 
    
    public List<UgTeam> UGTeams { get; set; }
    
    public List<GuestTeam> GuestTeams { get; set; }
    
    public List<Publication> Publications { get; set; }
    
    public List<Thesis> Theses { get; set; }

    public List<SpubTask> SPUBTasks { get; set; } 
}