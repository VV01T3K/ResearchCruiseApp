using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp_API.Domain.Entities;


public class Port : Entity
{
    [StringLength(1024)]
    public string Name { get; init; } = null!;

    public List<FormBPort> FormBPorts { get; init; } = [];

    public List<FormCPort> FormCPorts { get; init; } = [];


    public override bool Equals(object? other)
    {
        if (other is not Port otherPort)
            return false;

        return otherPort.Name == Name;
    }

    public override int GetHashCode()
    {
        return Name.GetHashCode();
    }
}