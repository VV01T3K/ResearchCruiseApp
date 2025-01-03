using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.Factories.ContractDtos;

public interface IContractDtosFactory
{
    Task<ContractDto> Create(Contract contract);
}
