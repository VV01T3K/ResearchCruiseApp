namespace ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;

public class FormASpubTaskDto
{
    public Guid Id { get; init; }

    public SpubTaskDto SpubTask { get; init; } = null!;

    public string Points { get; init; } = "0";
}
