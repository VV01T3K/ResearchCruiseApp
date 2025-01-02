using ResearchCruiseApp.Domain.Common.Interfaces;

namespace ResearchCruiseApp.Domain.Entities;


public class FormASpubTask : Entity, IEvaluated
{
    public FormA FormA { get; init; } = null!;

    public SpubTask SpubTask { get; init; } = null!;
    
    public int Points { get; set; }
}