using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp_API.Domain.Entities;


public class CruiseDayDetails : Entity
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

    
    public override bool Equals(object? other)
    {
        if (other is not CruiseDayDetails otherCruiseDayDetails)
            return false;

        return otherCruiseDayDetails.Number == Number &&
               otherCruiseDayDetails.Hours == Hours &&
               otherCruiseDayDetails.TaskName == TaskName &&
               otherCruiseDayDetails.Region == Region &&
               otherCruiseDayDetails.Position == Position &&
               otherCruiseDayDetails.Comment == Comment;
    }

    public override int GetHashCode()
    {
        return Number.GetHashCode() + 
               Hours.GetHashCode() +
               TaskName.GetHashCode() +
               Region.GetHashCode() +
               Position.GetHashCode() +
               Comment.GetHashCode();
    }
}