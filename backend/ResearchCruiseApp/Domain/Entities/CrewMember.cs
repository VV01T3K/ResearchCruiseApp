using System.ComponentModel.DataAnnotations;
using System.Linq.Expressions;
using ResearchCruiseApp.Domain.Common.Interfaces;

namespace ResearchCruiseApp.Domain.Entities;


public class CrewMember : Entity, IEquatable<CrewMember>, IEquatableByExpression<CrewMember>
{
    [StringLength(1024)]
    public string Title { get; init; } = null!;
    
    [StringLength(1024)]
    public string FirstName { get; init; } = null!;
    
    [StringLength(1024)]
    public string LastName { get; init; } = null!;
    
    [StringLength(1024)]
    public string BirthPlace { get; init; } = null!;
    
    [StringLength(1024)]
    public string BirthDate { get; init; } = null!;
    
    [StringLength(1024)]
    public string DocumentNumber { get; init; } = null!;
    
    [StringLength(1024)]
    public string DocumentExpiryDate { get; init; } = null!;
    
    [StringLength(1024)]
    public string Institution { get; init; } = null!;

    public List<FormB> FormsB { get; set; } = [];


    public override bool Equals(object? other) =>
        Equals((CrewMember?)other);

    public override int GetHashCode()
    {
        return Title.GetHashCode() +
               FirstName.GetHashCode() +
               LastName.GetHashCode() +
               BirthPlace.GetHashCode() +
               BirthDate.GetHashCode() +
               DocumentNumber.GetHashCode() +
               DocumentExpiryDate.GetHashCode() +
               Institution.GetHashCode();
    }
    
    public bool Equals(CrewMember? other)
    {
        return other is not null &&
               other.Title == Title &&
               other.FirstName == FirstName &&
               other.LastName == LastName &&
               other.BirthPlace == BirthPlace &&
               other.BirthDate == BirthDate &&
               other.DocumentNumber == DocumentNumber &&
               other.DocumentExpiryDate == DocumentExpiryDate &&
               other.Institution == Institution;
    }

    public static Expression<Func<CrewMember, bool>> EqualsByExpression(CrewMember? other)
    {
        return crewMember =>
            other != null &&
            other.Title == crewMember.Title &&
            other.FirstName == crewMember.FirstName &&
            other.LastName == crewMember.LastName &&
            other.BirthPlace == crewMember.BirthPlace &&
            other.BirthDate == crewMember.BirthDate &&
            other.DocumentNumber == crewMember.DocumentNumber &&
            other.DocumentExpiryDate == crewMember.DocumentExpiryDate &&
            other.Institution == crewMember.Institution;
    }
}