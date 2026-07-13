namespace ResearchCruiseApp.Domain.Entities;

public class FormBShortResearchEquipment : Entity
{
    public FormB FormB { get; init; } = null!;

    public ResearchEquipment ResearchEquipment { get; init; } = null!;
    public string StartDate { get; init; } = null!;
    public string EndDate { get; init; } = null!;
}
