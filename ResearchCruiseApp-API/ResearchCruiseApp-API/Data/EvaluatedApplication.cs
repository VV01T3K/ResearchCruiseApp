using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.InteropServices.JavaScript;
using NuGet.Protocol.Plugins;
using ResearchCruiseApp_API.Data.ResearchTaskFolder;
using ResearchCruiseApp_API.Models;
using ResearchCruiseApp_API.Tools;

namespace ResearchCruiseApp_API.Data;


public class EvaluatedApplication
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    
    public List<EvaluatedResearchTask> ResearchTasks { get; set; } = [];
    
    public List<EvaluatedContract> Contracts { get; set; }  = [];
    
    public List<UGTeam> UgTeams { get; set; } = [];
    public int UgTeamsPoints { get; set; }

    public List<GuestTeam> GuestTeams { get; set; } = [];

    public List<EvaluatedPublication> Publications { get; set; } = [];

    public List<EvaluatedResearchTask> CruiseEffects { get; set; } = [];

    public List<EvaluatedSPUBTask> SpubTasks { get; set; } = [];

}