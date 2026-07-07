using System.Linq.Expressions;
using ResearchCruiseApp.Domain.Interfaces;

namespace ResearchCruiseApp.Domain.Entities;

public class CrewMember : Entity, IEquatable<CrewMember>, IEquatableByExpression<CrewMember>
{
    public string Title { get; init; } = null!;
    public string FirstName { get; init; } = null!;
    public string LastName { get; init; } = null!;
    public string BirthPlace { get; init; } = null!;
    public string BirthDate { get; init; } = null!;
    public string DocumentNumber { get; init; } = null!;
    public string DocumentExpiryDate { get; init; } = null!;
    public string Institution { get; init; } = null!;

    public List<FormB> FormsB { get; set; } = [];

    public override bool Equals(object? other) => Equals((CrewMember?)other);

    public override int GetHashCode()
    {
        return HashCode.Combine(
            Title,
            FirstName,
            LastName,
            BirthPlace,
            BirthDate,
            DocumentNumber,
            DocumentExpiryDate,
            Institution
        );
    }

    public bool Equals(CrewMember? other)
    {
        return other is not null
            && other.Title == Title
            && other.FirstName == FirstName
            && other.LastName == LastName
            && other.BirthPlace == BirthPlace
            && other.BirthDate == BirthDate
            && other.DocumentNumber == DocumentNumber
            && other.DocumentExpiryDate == DocumentExpiryDate
            && other.Institution == Institution;
    }

    public static Expression<Func<CrewMember, bool>> EqualsByExpression(CrewMember? other)
    {
        return crewMember =>
            other != null
            && other.Title == crewMember.Title
            && other.FirstName == crewMember.FirstName
            && other.LastName == crewMember.LastName
            && other.BirthPlace == crewMember.BirthPlace
            && other.BirthDate == crewMember.BirthDate
            && other.DocumentNumber == crewMember.DocumentNumber
            && other.DocumentExpiryDate == crewMember.DocumentExpiryDate
            && other.Institution == crewMember.Institution;
    }
}
