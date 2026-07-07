using ResearchCruiseApp.Domain.Interfaces;

namespace ResearchCruiseApp.Domain.Entities;

public class ResearchArea : Entity, IDictionaryEntity
{
    public string Name { get; init; } = null!;

    public bool IsActive { get; set; }
}
