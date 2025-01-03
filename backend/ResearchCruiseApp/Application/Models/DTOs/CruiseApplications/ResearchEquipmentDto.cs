using System.ComponentModel.DataAnnotations;
using ResearchCruiseApp.Application.Models.Interfaces;

namespace ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;

public class ResearchEquipmentDto : IResearchEquipmentDto
{
    [StringLength(1024)]
    public string Name { get; init; } = null!;

    [StringLength(1024)]
    public string? InsuranceStartDate { get; init; }

    [StringLength(1024)]
    public string? InsuranceEndDate { get; init; }

    [StringLength(1024)]
    public string Permission { get; init; } = null!;
}
