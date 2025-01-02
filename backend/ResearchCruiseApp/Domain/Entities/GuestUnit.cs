using System.ComponentModel.DataAnnotations;
using System.Linq.Expressions;
using ResearchCruiseApp.Domain.Common.Interfaces;

namespace ResearchCruiseApp.Domain.Entities;


public class GuestUnit : Entity, IEquatable<GuestUnit>, IEquatableByExpression<GuestUnit>
{
    [StringLength(1024)]
    public string Name { get; init; } = null!;

    public List<FormAGuestUnit> FormAGuestUnits { get; init; } = [];

    public List<FormBGuestUnit> FormBGuestUnits { get; init; } = [];

    public List<FormCGuestUnit> FormCGuestUnits { get; init; } = [];


    public override bool Equals(object? other) =>
        Equals((GuestUnit?)other);

    public override int GetHashCode()
    {
        return Name.GetHashCode();
    }

    public bool Equals(GuestUnit? other)
    {
        return other is not null &&
               other.Name == Name;
    }

    public static Expression<Func<GuestUnit, bool>> EqualsByExpression(GuestUnit? other)
    {
        return guestUnit =>
            other != null &&
            other.Name == guestUnit.Name;
    }
}