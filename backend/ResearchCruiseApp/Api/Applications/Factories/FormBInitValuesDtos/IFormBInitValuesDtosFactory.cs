using ResearchCruiseApp.Api.Applications.Contracts;

namespace ResearchCruiseApp.Api.Applications.Factories.FormBInitValuesDtos;

public interface IFormBInitValuesDtosFactory
{
    Task<FormBInitValuesDto> Create(CancellationToken cancellationToken);
}
