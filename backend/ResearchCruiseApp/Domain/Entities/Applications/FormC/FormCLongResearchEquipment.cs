using ResearchCruiseApp.Domain;

namespace ResearchCruiseApp.Domain.Entities;

public class FormCLongResearchEquipment : Entity
{
    public FormC FormC { get; init; } = null!;

    public ResearchEquipment ResearchEquipment { get; init; } = null!;

    public ResearchEquipmentAction Action { get; init; }
    public string Duration { get; init; } = null!;
}
