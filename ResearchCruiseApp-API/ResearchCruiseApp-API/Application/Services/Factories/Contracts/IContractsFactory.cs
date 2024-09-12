using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.Factories.Contracts;


public interface IContractsFactory
{
    Task<Contract> Create(ContractDto contractDto);
}