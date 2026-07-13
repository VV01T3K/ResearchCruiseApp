using ResearchCruiseApp.Domain;

namespace ResearchCruiseApp.Domain.Entities;

public class FormASpubTask : Entity
{
    public FormA FormA { get; init; } = null!;

    public SpubTask SpubTask { get; init; } = null!;

    public int Points { get; set; }
}
