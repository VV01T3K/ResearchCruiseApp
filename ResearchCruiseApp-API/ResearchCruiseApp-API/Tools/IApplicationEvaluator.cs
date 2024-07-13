using ResearchCruiseApp_API.Data;
using ResearchTask = ResearchCruiseApp_API.Data.ResearchTask;

namespace ResearchCruiseApp_API.Tools;

public interface IApplicationEvaluator
{
    public EvaluatedApplication EvaluateApplication(FormA formA, List<ResearchTask> cruiseEffects);
    public int CalculateSumOfPoints(EvaluatedApplication evaluatedApplication);
}