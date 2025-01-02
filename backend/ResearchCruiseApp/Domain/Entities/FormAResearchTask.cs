using ResearchCruiseApp.Domain.Common.Interfaces;

namespace ResearchCruiseApp.Domain.Entities;


public class FormAResearchTask : Entity, IEvaluated
{
    public FormA FormA { get; init; } = null!;

    public ResearchTask ResearchTask { get; init; } = null!;
    
    public int Points { get; set; }
}