namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class CruiseApplicationEvaluationsEditsDto
{
    public List<EvaluationEditDto> ResearchTasksEvaluationsEdits { get; init; } = [];
    
    public List<EvaluationEditDto> ContractsEvaluationsEdits { get; init; } = [];
    
    public int NewUgUnitsPoints { get; init; }
    
    public List<EvaluationEditDto> PublicationsEvaluationsEdits { get; init; } = [];
    
    public List<EvaluationEditDto> SpubTaskEvaluationsEdits { get; init; } = [];
}