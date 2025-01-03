using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.CruiseApplicationEvaluator;

public interface ICruiseApplicationEvaluator
{
    Task Evaluate(
        CruiseApplication cruiseApplication,
        bool isDraft,
        CancellationToken cancellationToken
    );

    int GetPointsSum(CruiseApplication cruiseApplication);
}
