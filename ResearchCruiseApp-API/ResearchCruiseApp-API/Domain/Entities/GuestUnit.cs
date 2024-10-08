using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp_API.Domain.Entities;


public class GuestUnit : Entity
{
    [StringLength(1024)]
    public string Name { get; init; } = null!;

    public List<FormAGuestUnit> FormAGuestUnits { get; init; } = [];

    public List<FormBGuestUnit> FormBGuestUnits { get; init; } = [];
    
    public List<FormCGuestUnit> FormCGuestUnits { get; init; } = [];
    
    
    public override bool Equals(object? other)
    {
        if (other is not GuestUnit otherGuestUnit)
            return false;

        return otherGuestUnit.Name == Name;
    }
    
    public override int GetHashCode()
    {
        return Name.GetHashCode();
    }
}