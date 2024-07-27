using ResearchCruiseApp_API.Domain.Entities;
using ResearchTask = ResearchCruiseApp_API.Domain.Entities.ResearchTask;

namespace ResearchCruiseApp_API.Infrastructure.Tools;


public interface ICruiseApplicationEvaluator
{
    public EvaluatedCruiseApplication EvaluateCruiseApplication(FormA formA, List<ResearchTask> cruiseEffects);
    public int CalculateSumOfPoints(EvaluatedCruiseApplication evaluatedCruiseApplication);
}