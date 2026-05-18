using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Factories.CruiseApplicationEvaluationDetailsDtos;

public interface ICruiseApplicationEvaluationDetailsDtosFactory
{
    Task<CruiseApplicationEvaluationDetailsDto> Create(
        CruiseApplication cruiseApplication,
        CancellationToken cancellationToken
    );
}
