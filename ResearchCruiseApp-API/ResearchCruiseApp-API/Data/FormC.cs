using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.InteropServices.JavaScript;
using NuGet.Protocol.Plugins;
using ResearchCruiseApp_API.Data.ResearchTaskFolder;
using ResearchCruiseApp_API.Models;

namespace ResearchCruiseApp_API.Data;


public class FormC
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
    
    public List<int> ResearchArea { get; set; } 
    
    public int CruiseGoal { get; set; }
    public string CruiseGoalDescription { get; set; }
    
    public List<ResearchTask> ResearchTasks { get; set; } 
    
    public List<Contract> Contracts { get; set; } 
    
    public List<UGTeam> UGTeams { get; set; }
    
    public List<GuestTeam> GuestTeams { get; set; }
    
    public List<Publication> Publications { get; set; }
    
    public List<Work> Works { get; set; }

    public List<SPUBTask> SPUBTasks { get; set; } 
    //Empty constructor is redundant - as Rider says
    /*
    public FormC()
    {
    }
    */
}