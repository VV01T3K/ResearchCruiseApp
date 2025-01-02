using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.Factories.Contracts;


public interface IContractsFactory
{
    Task<Contract> Create(ContractDto contractDto);
}