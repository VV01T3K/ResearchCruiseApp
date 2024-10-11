namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;

public class DetailedPlanDto
{
    public string Day { get; set; } = null!;
    public string Hours { get; set; } = null!;
    public string TaskName { get; set; } = null!;
    public string Region { get; set; } = null!;
    public string Position { get; set; } = null!;
    public string Notes { get; set; } = null!;
}