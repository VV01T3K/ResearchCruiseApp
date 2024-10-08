using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp_API.Domain.Entities;


public class ResearchEquipment : Entity
{
    [StringLength(1024)]
    public string Name { get; init; } = null!;

    public List<FormBShortResearchEquipment> FormBShortResearchEquipments { get; init; } = [];

    public List<FormBLongResearchEquipment> FormBLongResearchEquipments { get; init; } = [];

    public List<FormBResearchEquipment> FormBResearchEquipments { get; init; } = [];

    public List<FormCShortResearchEquipment> FormCShortResearchEquipments { get; init; } = [];

    public List<FormCLongResearchEquipment> FormCLongResearchEquipments { get; init; } = [];

    public List<FormCResearchEquipment> FormCResearchEquipments { get; init; } = [];


    public override bool Equals(object? other)
    {
        if (other is not ResearchEquipment otherResearchEquipment)
            return false;

        return otherResearchEquipment.Name == Name;
    }

    public override int GetHashCode()
    {
        return Name.GetHashCode();
    }
}