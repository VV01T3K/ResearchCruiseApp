using System.ComponentModel.DataAnnotations;
using System.Linq.Expressions;
using ResearchCruiseApp.Domain.Common.Interfaces;

namespace ResearchCruiseApp.Domain.Entities;


public class CruiseDayDetails : Entity, IEquatable<CruiseDayDetails>, IEquatableByExpression<CruiseDayDetails>
{
    [StringLength(1024)]
    public string Number { get; init; } = null!;

    [StringLength(1024)]
    public string Hours { get; init; } = null!;
    
    [StringLength(1024)]
    public string TaskName { get; init; } = null!;

    [StringLength(1024)]
    public string Region { get; init; } = null!;

    [StringLength(1024)]
    public string Position { get; init; } = null!;

    [StringLength(1024)]
    public string Comment { get; init; } = null!;

    public List<FormB> FormsB { get; init; } = [];
    
    public List<FormC> FormsC { get; init; } = [];


    public override bool Equals(object? other) =>
        Equals((CruiseDayDetails?)other);

    public override int GetHashCode()
    {
        return Number.GetHashCode() + 
               Hours.GetHashCode() +
               TaskName.GetHashCode() +
               Region.GetHashCode() +
               Position.GetHashCode() +
               Comment.GetHashCode();
    }
    
    public bool Equals(CruiseDayDetails? other)
    {
        return other is not null &&
               other.Number == Number &&
               other.Hours == Hours &&
               other.TaskName == TaskName &&
               other.Region == Region &&
               other.Position == Position &&
               other.Comment == Comment;
    }

    public static Expression<Func<CruiseDayDetails, bool>> EqualsByExpression(CruiseDayDetails? other)
    {
        return cruiseDayDetails =>
            other != null &&
            other.Number == cruiseDayDetails.Number &&
            other.Hours == cruiseDayDetails.Hours &&
            other.TaskName == cruiseDayDetails.TaskName &&
            other.Region == cruiseDayDetails.Region &&
            other.Position == cruiseDayDetails.Position &&
            other.Comment == cruiseDayDetails.Comment;
    }
}