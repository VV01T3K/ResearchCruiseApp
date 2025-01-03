using ResearchCruiseApp.Domain.Common.Interfaces;

namespace ResearchCruiseApp.Domain.Entities;

public class FormAPublication : Entity, IEvaluated
{
    public FormA FormA { get; init; } = null!;

    public Publication Publication { get; init; } = null!;

    public int Points { get; set; }
}
