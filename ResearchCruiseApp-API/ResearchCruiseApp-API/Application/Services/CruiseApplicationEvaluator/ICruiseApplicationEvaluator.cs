using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.CruiseApplicationEvaluator;


public interface ICruiseApplicationEvaluator
{
    Task Evaluate(CruiseApplication cruiseApplication, bool isDraft, CancellationToken cancellationToken);
    
    int GetPointsSum(CruiseApplication cruiseApplication);
}