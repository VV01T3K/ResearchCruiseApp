using ResearchCruiseApp_API.Domain.Common.Interfaces;

namespace ResearchCruiseApp_API.Domain.Entities;


public class FormASpubTask : Entity, IEvaluated
{
    public FormA FormA { get; init; } = null!;

    public SpubTask SpubTask { get; init; } = null!;
    
    public int Points { get; set; }
}