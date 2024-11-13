namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class PublicationDto
{
    public string Category { get; init; } = null!;

    public string Doi { get; init; } = null!;

    public string Authors { get; init; } = null!;

    public string Title { get; init; } = null!;

    public string Magazine { get; init; } = null!;
    
    public string Year { get; init; } = null!;

    public string MinisterialPoints { get; init; } = null!;
}