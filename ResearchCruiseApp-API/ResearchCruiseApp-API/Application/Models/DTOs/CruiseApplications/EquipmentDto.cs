namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;

public class EquipmentDto
{
    public string StartDate { get; set; } = null!;
    public string EndDate { get; set; } = null!;
    public string Name { get; set; } = null!;
    public bool Insurance { get; set; }
    public bool Permission { get; set; }
}