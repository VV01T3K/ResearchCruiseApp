using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResearchCruiseApp_API.Domain.Entities;


public class SpubTask : Entity
{
    public int YearFrom { get; init; }
    
    public int YearTo { get; init; }
    
    [StringLength(1024)]
    public string Name { get; init; } = null!;
    
    public List<FormASpubTask> FormASpubTasks { get; init; } = [];


    public override bool Equals(object? other)
    {
        if (other is null)
            return false;

        var otherSpubTask = (SpubTask)other;

        return otherSpubTask.YearFrom == YearFrom &&
               otherSpubTask.YearTo == YearTo &&
               otherSpubTask.Name == Name;
    }

    public override int GetHashCode()
    {
        return YearFrom.GetHashCode() +
               YearTo.GetHashCode() +
               Name.GetHashCode();
    }
}