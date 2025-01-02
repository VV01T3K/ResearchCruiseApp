namespace ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;


public class ContractDto
{
    public string Category { get; init; } = null!;

    public string InstitutionName { get; init; } = null!;
    
    public string InstitutionUnit { get; init; } = null!;
    
    public string InstitutionLocalization { get; init; } = null!;

    public string Description { get; init; } = null!;

    public FileDto Scan { get; set; } = null!;
}