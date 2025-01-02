namespace ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;


public class CruiseApplicationEvaluationsEditsDto
{
    public List<EvaluationEditDto> ResearchTasksEvaluationsEdits { get; init; } = [];
    
    public List<EvaluationEditDto> ContractsEvaluationsEdits { get; init; } = [];

    public string NewUgUnitsPoints { get; init; } = "0";
    
    public List<EvaluationEditDto> PublicationsEvaluationsEdits { get; init; } = [];

    public List<EvaluationEditDto> SpubTaskEvaluationsEdits { get; init; } = [];
}