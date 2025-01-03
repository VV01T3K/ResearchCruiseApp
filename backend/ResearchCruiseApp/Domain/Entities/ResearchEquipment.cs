using System.ComponentModel.DataAnnotations;
using System.Linq.Expressions;
using ResearchCruiseApp.Domain.Common.Interfaces;

namespace ResearchCruiseApp.Domain.Entities;

public class ResearchEquipment
    : Entity,
        IEquatable<ResearchEquipment>,
        IEquatableByExpression<ResearchEquipment>
{
    [StringLength(1024)]
    public string Name { get; init; } = null!;

    public List<FormBShortResearchEquipment> FormBShortResearchEquipments { get; init; } = [];

    public List<FormBLongResearchEquipment> FormBLongResearchEquipments { get; init; } = [];

    public List<FormBResearchEquipment> FormBResearchEquipments { get; init; } = [];

    public List<FormCShortResearchEquipment> FormCShortResearchEquipments { get; init; } = [];

    public List<FormCLongResearchEquipment> FormCLongResearchEquipments { get; init; } = [];

    public List<FormCResearchEquipment> FormCResearchEquipments { get; init; } = [];

    public override bool Equals(object? other) => Equals((ResearchEquipment?)other);

    public override int GetHashCode()
    {
        return Name.GetHashCode();
    }

    public bool Equals(ResearchEquipment? other)
    {
        return other is not null && other.Name == Name;
    }

    public static Expression<Func<ResearchEquipment, bool>> EqualsByExpression(
        ResearchEquipment? other
    )
    {
        return researchEquipment => other != null && researchEquipment.Name == other.Name;
    }
}
