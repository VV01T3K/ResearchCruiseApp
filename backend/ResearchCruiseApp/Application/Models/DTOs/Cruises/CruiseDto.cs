namespace ResearchCruiseApp.Application.Models.DTOs.Cruises;


public class CruiseDto
{
    public Guid Id { get; set; }
    
    public string Number { get; set; } = null!;

    public string StartDate { get; set; } = null!;

    public string EndDate { get; set; } = null!;
    
    public Guid MainCruiseManagerId { get; set; }
    
    public string MainCruiseManagerFirstName { get; set; } = null!;
    
    public string MainCruiseManagerLastName { get; set; } = null!;
    
    public Guid MainDeputyManagerId { get; set; }
    
    public List<CruiseApplicationShortInfoDto> CruiseApplicationsShortInfo { get; set; } = [];

    public string Status { get; init; } = null!;
}   