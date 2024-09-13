using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.Factories.ContractDtos;

public interface IContractDtosFactory
{
    Task<ContractDto> Create(Contract contract);
}