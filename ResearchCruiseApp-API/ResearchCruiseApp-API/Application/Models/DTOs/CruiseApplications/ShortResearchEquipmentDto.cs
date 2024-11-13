using System.ComponentModel.DataAnnotations;
using ResearchCruiseApp_API.Application.Models.Interfaces;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class ShortResearchEquipmentDto : IResearchEquipmentDto
{
    [StringLength(1024)]
    public string Name { get; init; } = null!;
    
    [StringLength(1024)]
    public string StartDate { get; init; } = null!;

    [StringLength(1024)]
    public string EndDate { get; init; } = null!;
}