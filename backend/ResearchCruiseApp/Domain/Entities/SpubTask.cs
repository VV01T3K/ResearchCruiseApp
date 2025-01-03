using System.ComponentModel.DataAnnotations;
using System.Linq.Expressions;
using ResearchCruiseApp.Domain.Common.Interfaces;

namespace ResearchCruiseApp.Domain.Entities;

public class SpubTask : Entity, IEquatable<SpubTask>, IEquatableByExpression<SpubTask>
{
    [StringLength(1024)]
    public string Name { get; init; } = null!;

    [StringLength(1024)]
    public string YearFrom { get; init; } = null!;

    [StringLength(1024)]
    public string YearTo { get; init; } = null!;

    public List<FormASpubTask> FormASpubTasks { get; init; } = [];

    public List<FormC> FormsC { get; init; } = [];

    public override bool Equals(object? other) => Equals((SpubTask?)other);

    public override int GetHashCode()
    {
        return YearFrom.GetHashCode() + YearTo.GetHashCode() + Name.GetHashCode();
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
