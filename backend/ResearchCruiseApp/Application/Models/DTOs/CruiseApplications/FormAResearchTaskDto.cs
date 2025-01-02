namespace ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;


public class FormAResearchTaskDto
{
    public Guid Id { get; init; }
    
    public ResearchTaskDto ResearchTask { get; init; } = null!;

    public string Points { get; init; } = "0";
}