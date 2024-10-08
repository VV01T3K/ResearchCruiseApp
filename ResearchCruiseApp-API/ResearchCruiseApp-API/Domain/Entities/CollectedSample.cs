using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp_API.Domain.Entities;


public class CollectedSample : Entity
{
    [StringLength(1024)]
    public string Type { get; init; } = null!;
    
    [StringLength(1024)]
    public string Amount { get; init; } = null!;
    
    [StringLength(1024)]
    public string Analysis { get; init; } = null!;

    [StringLength(1024)]
    public string Publishing { get; init; } = null!;
}