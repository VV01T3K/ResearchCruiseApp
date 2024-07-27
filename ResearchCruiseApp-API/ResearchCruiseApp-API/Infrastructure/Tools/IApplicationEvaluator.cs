using ResearchCruiseApp_API.Domain.Entities;
using ResearchTask = ResearchCruiseApp_API.Domain.Entities.ResearchTask;

namespace ResearchCruiseApp_API.Infrastructure.Tools;


public interface IApplicationEvaluator
{
    public EvaluatedApplication EvaluateApplication(FormA formA, List<ResearchTask> cruiseEffects);
    public int CalculateSumOfPoints(EvaluatedApplication evaluatedApplication);
}