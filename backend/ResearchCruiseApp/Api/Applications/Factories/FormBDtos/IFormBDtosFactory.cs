using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Factories.FormBDtos;

public interface IFormBDtosFactory
{
    Task<FormBDto> Create(FormB formB, CancellationToken cancellationToken);
}
