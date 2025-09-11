using System.ComponentModel.DataAnnotations;

namespace ResearchCruiseApp.Domain.Entities;

public class CollectedSample : Entity
{
    [StringLength(10240)]
    public string Type { get; init; } = null!;

    [StringLength(10240)]
    public string Amount { get; init; } = null!;

    [StringLength(10240)]
    public string Analysis { get; init; } = null!;

    [StringLength(10240)]
    public string Publishing { get; init; } = null!;
}
