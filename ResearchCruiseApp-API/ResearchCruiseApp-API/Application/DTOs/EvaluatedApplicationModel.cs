using ResearchCruiseApp_API.Application.DTOs.DataTypes;

namespace ResearchCruiseApp_API.Application.DTOs;


public class EvaluatedApplicationModel
{
    public List<EvaluatedResearchTask> ResearchTasks { get; set; } = [];
    
    public List<EvaluatedContract> Contracts { get; set; }  = [];
    
    public List<UgTeam> UgTeams { get; set; } = [];
    public int UgTeamsPoints { get; set; }

    public List<GuestTeam> GuestTeams { get; set; } = [];

    public List<EvaluatedPublication> Publications { get; set; } = [];

    public List<EvaluatedResearchTask> CruiseEffects { get; set; } = [];

    public List<EvaluatedSpubTask> SpubTasks { get; set; } = [];
}