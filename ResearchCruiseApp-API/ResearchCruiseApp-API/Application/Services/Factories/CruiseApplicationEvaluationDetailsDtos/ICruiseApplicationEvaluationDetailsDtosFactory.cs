using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.Factories.CruiseApplicationEvaluationDetailsDtos;


public interface ICruiseApplicationEvaluationDetailsDtosFactory
{
    Task<CruiseApplicationEvaluationDetailsDto> Create(
        CruiseApplication cruiseApplication, CancellationToken cancellationToken);
}