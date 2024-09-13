using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp_API.Domain.Entities;


public class SpubTask : Entity
{
    [StringLength(1024)] public string YearFrom { get; init; } = null!;

    [StringLength(1024)] public string YearTo { get; init; } = null!;
    
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