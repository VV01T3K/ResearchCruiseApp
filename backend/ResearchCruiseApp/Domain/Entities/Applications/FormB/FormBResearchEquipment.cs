namespace ResearchCruiseApp.Domain.Entities;

public class FormBResearchEquipment : Entity
{
    public FormB FormB { get; init; } = null!;

    public ResearchEquipment ResearchEquipment { get; init; } = null!;
    public string? InsuranceStartDate { get; init; }
    public string? InsuranceEndDate { get; init; }
    public string Permission { get; init; } = null!;
}
