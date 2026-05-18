using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Factories.FormAInitValuesDtos;

public interface IFormAInitValuesDtosFactory
{
    Task<FormAInitValuesDto> Create(CancellationToken cancellationToken);

    Task<FormAInitValuesDto> CreateForSupervisor(
        CruiseApplication cruiseApplication,
        CancellationToken cancellationToken
    );
}
