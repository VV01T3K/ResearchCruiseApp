using ResearchCruiseApp_API.Domain.Common.Interfaces;

namespace ResearchCruiseApp_API.Domain.Entities;


public class FormAPublication : Entity, IEvaluated
{
    public FormA FormA { get; init; } = null!;

    public Publication Publication { get; init; } = null!;
    
    public int Points { get; set; }
}