using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp_API.Domain.Entities;


public class FormCResearchEquipment : Entity
{
    public FormC FormC { get; init; } = null!;

    public ResearchEquipment ResearchEquipment { get; init; } = null!;

    [StringLength(1024)]
    public string Insurance { get; init; } = null!;

    [StringLength(1024)]
    public string Permission { get; init; } = null!;
}