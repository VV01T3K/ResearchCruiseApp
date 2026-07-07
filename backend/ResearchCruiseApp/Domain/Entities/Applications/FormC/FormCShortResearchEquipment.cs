namespace ResearchCruiseApp.Domain.Entities;

public class FormCShortResearchEquipment : Entity
{
    public FormC FormC { get; init; } = null!;

    public ResearchEquipment ResearchEquipment { get; init; } = null!;
    public string StartDate { get; init; } = null!;
    public string EndDate { get; init; } = null!;
}
