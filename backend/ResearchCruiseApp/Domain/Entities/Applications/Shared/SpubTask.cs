using System.Linq.Expressions;
using ResearchCruiseApp.Domain;

namespace ResearchCruiseApp.Domain.Entities;

public class SpubTask : Entity, IEquatable<SpubTask>, IEquatableByExpression<SpubTask>
{
    public string? Name { get; init; }
    public string? YearFrom { get; init; }
    public string? YearTo { get; init; }

    public List<FormASpubTask> FormASpubTasks { get; init; } = [];

    public List<FormC> FormsC { get; init; } = [];

    public override bool Equals(object? obj) => Equals((SpubTask?)obj);

    public override int GetHashCode()
    {
        return HashCode.Combine(YearFrom, YearTo, Name);
    }

    public bool Equals(SpubTask? other)
    {
        return other is not null
            && other.YearFrom == YearFrom
            && other.YearTo == YearTo
            && other.Name == Name;
    }

    public static Expression<Func<SpubTask, bool>> EqualsByExpression(SpubTask? other)
    {
        return spubTask =>
            other != null
            && other.Name == spubTask.Name
            && other.YearFrom == spubTask.YearFrom
            && other.YearTo == spubTask.YearTo;
    }
}
