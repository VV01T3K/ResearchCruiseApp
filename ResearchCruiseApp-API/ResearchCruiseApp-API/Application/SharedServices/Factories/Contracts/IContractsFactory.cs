using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.SharedServices.Factories.Contracts;


public interface IContractsFactory
{
    Task<Contract> Create(ContractDto contractDto);
}