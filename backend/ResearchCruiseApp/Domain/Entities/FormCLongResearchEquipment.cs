using System.ComponentModel.DataAnnotations;
using ResearchCruiseApp.Domain.Common.Enums;

namespace ResearchCruiseApp.Domain.Entities;

public class FormCLongResearchEquipment : Entity
{
    public FormC FormC { get; init; } = null!;

    public ResearchEquipment ResearchEquipment { get; init; } = null!;

    public ResearchEquipmentAction Action { get; init; }

    [StringLength(1024)]
    public string Duration { get; init; } = null!;
}
