namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;

public class CrewDto
{
    public string Title { get; set; } = null!;
    public string Names { get; set; } = null!;
    public string Surname { get; set; } = null!;
    public string BirthPlace { get; set; } = null!;
    public string BirthDate { get; set; } = null!;
    public string ID { get; set; } = null!;
    public string ExpiryDate { get; set; } = null!;
    public string Institution { get; set; } = null!;
}