namespace ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;

public class ContractDto
{
    public string Category { get; init; } = null!;

    public string? InstitutionName { get; init; }

    public string? InstitutionUnit { get; init; }

    public string? InstitutionLocalization { get; init; }

    public string? Description { get; init; }

    public List<FileDto> Scans { get; set; } = [];
}
