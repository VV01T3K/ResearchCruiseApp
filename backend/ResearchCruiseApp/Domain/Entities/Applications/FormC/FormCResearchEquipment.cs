namespace ResearchCruiseApp.Domain.Entities;

public class FormCResearchEquipment : Entity
{
    public FormC FormC { get; init; } = null!;

    public ResearchEquipment ResearchEquipment { get; init; } = null!;
    public string? InsuranceStartDate { get; init; }
    public string? InsuranceEndDate { get; init; }
    public string Permission { get; init; } = null!;
}
