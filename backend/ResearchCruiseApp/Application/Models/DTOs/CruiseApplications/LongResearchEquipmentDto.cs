using System.ComponentModel.DataAnnotations;
using ResearchCruiseApp.Application.Models.Interfaces;

namespace ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;


public class LongResearchEquipmentDto : IResearchEquipmentDto
{
    [StringLength(1024)]
    public string Name { get; init; } = null!;

    [StringLength(1024)]
    public string Action { get; init; } = null!;
    
    [StringLength(1024)]
    public string Duration { get; init; } = null!;
}