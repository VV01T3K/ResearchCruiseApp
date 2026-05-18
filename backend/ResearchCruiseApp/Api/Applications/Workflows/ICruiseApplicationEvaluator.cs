using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Workflows;

public interface ICruiseApplicationEvaluator
{
    Task Evaluate(
        CruiseApplication cruiseApplication,
        bool isDraft,
        CancellationToken cancellationToken
    );

    int GetPointsSum(CruiseApplication cruiseApplication);
}
