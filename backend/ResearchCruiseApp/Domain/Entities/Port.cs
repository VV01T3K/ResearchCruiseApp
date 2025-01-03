using System.ComponentModel.DataAnnotations;
using System.Linq.Expressions;
using ResearchCruiseApp.Domain.Common.Interfaces;

namespace ResearchCruiseApp.Domain.Entities;

public class Port : Entity, IEquatable<Port>, IEquatableByExpression<Port>
{
    [StringLength(1024)]
    public string Name { get; init; } = null!;

    public List<FormBPort> FormBPorts { get; init; } = [];

    public List<FormCPort> FormCPorts { get; init; } = [];

    public override bool Equals(object? other) => Equals((Port?)other);

    public override int GetHashCode()
    {
        return Name.GetHashCode();
    }

    public bool Equals(Port? other)
    {
        return other is not null && other.Name == Name;
    }

    public static Expression<Func<Port, bool>> EqualsByExpression(Port? other)
    {
        return port => other != null && other.Name == port.Name;
    }
}
