using ResearchCruiseApp.Domain;

namespace ResearchCruiseApp.Domain.Entities;

public class FormBLongResearchEquipment : Entity
{
    public FormB FormB { get; init; } = null!;

    public ResearchEquipment ResearchEquipment { get; init; } = null!;

    public ResearchEquipmentAction Action { get; init; }
    public string Duration { get; init; } = null!;
}
