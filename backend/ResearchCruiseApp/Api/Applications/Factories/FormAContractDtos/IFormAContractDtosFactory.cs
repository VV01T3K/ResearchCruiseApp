using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Factories.FormAContractDtos;

public interface IFormAContractDtosFactory
{
    Task<FormAContractDto> Create(FormAContract formAContract);
}
