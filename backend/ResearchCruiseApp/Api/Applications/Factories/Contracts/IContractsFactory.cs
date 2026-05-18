using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Factories.Contracts;

public interface IContractsFactory
{
    Task<Contract> Create(ContractDto contractDto);
}
