namespace ResearchCruiseApp_API.Models;


public class EvaluatedApplicationModel
{
    public List<EvaluatedResearchTask> ResearchTasks { get; set; } = [];
    
    public List<EvaluatedContract> Contracts { get; set; }  = [];
    
    public List<UGTeam> UgTeams { get; set; } = [];
    public int UgTeamsPoints { get; set; }

    public List<GuestTeam> GuestTeams { get; set; } = [];

    public List<EvaluatedPublication> Publications { get; set; } = [];

    public List<EvaluatedResearchTask> CruiseEffects { get; set; } = [];

    public List<EvaluatedSPUBTask> SpubTasks { get; set; } = [];
}