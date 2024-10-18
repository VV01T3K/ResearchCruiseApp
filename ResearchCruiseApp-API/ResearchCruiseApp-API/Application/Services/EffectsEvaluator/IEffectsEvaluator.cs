using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.EffectsEvaluator;


public interface IEffectsEvaluator
{
    Task Evaluate(CruiseApplication cruiseApplication, CancellationToken cancellationToken);
}