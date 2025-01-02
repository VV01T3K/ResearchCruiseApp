using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp.Domain.Entities;


public class FormCResearchEquipment : Entity
{
    public FormC FormC { get; init; } = null!;

    public ResearchEquipment ResearchEquipment { get; init; } = null!;

    [StringLength(1024)]
    public string? InsuranceStartDate { get; init; }
    
    [StringLength(1024)]
    public string? InsuranceEndDate { get; init; }
    
    [StringLength(1024)]
    public string Permission { get; init; } = null!;
}