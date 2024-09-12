using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.CruiseApplicationEvaluator;


public interface ICruiseApplicationEvaluator
{
    void Evaluate(CruiseApplication cruiseApplication);
    int GetPointsSum(CruiseApplication cruiseApplication);
}