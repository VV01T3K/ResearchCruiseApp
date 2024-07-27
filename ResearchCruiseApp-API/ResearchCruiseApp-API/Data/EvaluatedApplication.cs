using System.ComponentModel.DataAnnotations.Schema;

namespace ResearchCruiseApp_API.Data;


public class EvaluatedApplication
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }
    
    public List<EvaluatedResearchTask> ResearchTasks { get; set; } = [];
    
    public List<EvaluatedContract> Contracts { get; set; }  = [];
    public int UgTeamsPoints { get; set; }

    public List<EvaluatedPublication> Publications { get; set; } = [];

    public List<EvaluatedResearchTask> CruiseEffects { get; set; } = [];

    public List<EvaluatedSPUBTask> SpubTasks { get; set; } = [];

}