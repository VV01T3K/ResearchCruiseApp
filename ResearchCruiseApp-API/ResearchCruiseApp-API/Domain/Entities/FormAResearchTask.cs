using ResearchCruiseApp_API.Domain.Common.Interfaces;

namespace ResearchCruiseApp_API.Domain.Entities;


public class FormAResearchTask : Entity, IEvaluated
{
    public FormA FormA { get; init; } = null!;

    public ResearchTask ResearchTask { get; init; } = null!;
    
    public int Points { get; set; }
}