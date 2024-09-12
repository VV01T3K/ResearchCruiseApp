using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp_API.Domain.Entities;


public class GuestUnit : Entity
{
    [StringLength(1024)]
    public string Name { get; init; } = null!;

    public List<FormAGuestUnit> FormAGuestUnits { get; set; } = [];
    
    
    public override bool Equals(object? other)
    {
        if (other is null)
            return false;

        var otherGuestUnit = (GuestUnit)other;

        return otherGuestUnit.Name == Name;
    }
    
    public override int GetHashCode()
    {
        return Name.GetHashCode();
    }
}