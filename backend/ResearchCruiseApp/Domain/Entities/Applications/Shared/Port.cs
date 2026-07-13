using System.Linq.Expressions;
using ResearchCruiseApp.Domain;

namespace ResearchCruiseApp.Domain.Entities;

public class Port : Entity, IEquatable<Port>, IEquatableByExpression<Port>
{
    public string Name { get; init; } = null!;

    public List<FormBPort> FormBPorts { get; init; } = [];

    public List<FormCPort> FormCPorts { get; init; } = [];

    public override bool Equals(object? obj) => Equals((Port?)obj);

    public override int GetHashCode()
    {
        return HashCode.Combine(Name);
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
