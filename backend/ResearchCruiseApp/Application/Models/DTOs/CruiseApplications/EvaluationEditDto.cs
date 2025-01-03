namespace ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;

public class EvaluationEditDto
{
    public Guid EvaluationId { get; set; }

    public string NewPoints { get; set; } = "0";
}
