using System.ComponentModel.DataAnnotations;
using System.Linq.Expressions;
using ResearchCruiseApp.Domain.Common.Interfaces;

namespace ResearchCruiseApp.Domain.Entities;

public class ResearchAreaDescription
    : Entity,
        IEquatable<ResearchAreaDescription>,
        IEquatableByExpression<ResearchAreaDescription>
{
    public Guid? AreaId { get; init; }

    [StringLength(1024)]
    public string? DifferentName { get; init; }

    [StringLength(10240)]
    public string Info { get; init; } = "";

    public List<FormA> FormsA { get; init; } = [];

    public List<FormC> FormsC { get; init; } = [];

    public override bool Equals(object? other) => Equals((ResearchAreaDescription?)other);

    public override int GetHashCode()
    {
        return HashCode.Combine(Id, DifferentName, Info);
    }

    public bool Equals(ResearchAreaDescription? other)
    {
        return other is not null
            && other.Id == Id
            && other.DifferentName == DifferentName
            && other.Info == Info;
    }

    public static Expression<Func<ResearchAreaDescription, bool>> EqualsByExpression(
        ResearchAreaDescription? other
    )
    {
        return researchAreaDescription =>
            other != null
            && researchAreaDescription.Id == other.Id
            && other.DifferentName == researchAreaDescription.DifferentName
            && other.Info == researchAreaDescription.Info;
    }
}
