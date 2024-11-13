namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class ContractDto
{
    public string Category { get; set; } = null!;

    public string InstitutionName { get; set; } = null!;
    
    public string InstitutionUnit { get; set; } = null!;
    
    public string InstitutionLocalization { get; set; } = null!;

    public string Description { get; set; } = null!;

    public FileDto Scan { get; set; } = null!;
}