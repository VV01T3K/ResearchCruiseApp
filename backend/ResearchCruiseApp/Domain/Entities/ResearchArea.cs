using ResearchCruiseApp.Domain;

namespace ResearchCruiseApp.Domain.Entities;

public class ResearchArea : Entity
{
    public string Name { get; init; } = null!;

    public bool IsActive { get; set; }
}
