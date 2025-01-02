using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.Factories.CruiseApplicationEvaluationDetailsDtos;


public interface ICruiseApplicationEvaluationDetailsDtosFactory
{
    Task<CruiseApplicationEvaluationDetailsDto> Create(
        CruiseApplication cruiseApplication, CancellationToken cancellationToken);
}