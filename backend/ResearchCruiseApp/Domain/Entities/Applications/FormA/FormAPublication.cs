using ResearchCruiseApp.Domain;

namespace ResearchCruiseApp.Domain.Entities;

public class FormAPublication : Entity
{
    public FormA FormA { get; init; } = null!;

    public Publication Publication { get; init; } = null!;

    public int Points { get; set; }
}
