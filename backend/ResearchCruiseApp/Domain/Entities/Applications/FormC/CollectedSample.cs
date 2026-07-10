namespace ResearchCruiseApp.Domain.Entities;

public class CollectedSample : Entity
{
    public string Type { get; init; } = null!;
    public string Amount { get; init; } = null!;
    public string Analysis { get; init; } = null!;
    public string Publishing { get; init; } = null!;
}
