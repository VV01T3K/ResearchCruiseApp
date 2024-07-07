using ResearchCruiseApp_API.Models;

namespace ResearchCruiseApp_API.Tools;

public interface IApplicationEvaluator
{
    public EvaluatedApplicationModel EvaluateApplication(FormAModel formA, List<ResearchTask> cruiseEffects);
    public int CalculateSumOfPoints(EvaluatedApplicationModel evaluatedApplication);
}