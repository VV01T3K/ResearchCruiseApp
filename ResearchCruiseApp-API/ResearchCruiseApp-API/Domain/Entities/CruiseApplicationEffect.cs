using ResearchCruiseApp_API.Domain.Common.Interfaces;

namespace ResearchCruiseApp_API.Domain.Entities;


public class CruiseApplicationEffect : Entity, IEvaluated
{
    public CruiseApplication CruiseApplication { get; init; } = null!;

    public ResearchTaskEffect Effect { get; init; } = null!;

    public int Points { get; set; }
}