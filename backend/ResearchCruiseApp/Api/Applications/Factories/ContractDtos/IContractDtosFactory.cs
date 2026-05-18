using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Factories.ContractDtos;

public interface IContractDtosFactory
{
    Task<ContractDto> Create(Contract contract);
}
