namespace ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;

public class PublicationDto
{
    public Guid Id { get; set; }

    public string Category { get; init; } = null!;

    public string? Doi { get; init; }

    public string? Authors { get; init; }

    public string? Title { get; init; }

    public string? Magazine { get; init; }

    public string? Year { get; init; }

    public string MinisterialPoints { get; init; } = null!;
}
