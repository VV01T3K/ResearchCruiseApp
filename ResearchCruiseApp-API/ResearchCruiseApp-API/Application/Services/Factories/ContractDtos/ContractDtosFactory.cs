using AutoMapper;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Application.Services.Factories.FileDtos;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.Factories.ContractDtos;


internal class ContractDtosFactory(IMapper mapper, IFileDtosFactory fileDtosFactory) : IContractDtosFactory
{
    public async Task<ContractDto> Create(Contract contract)
    {
        var contractDto = mapper.Map<ContractDto>(contract);

        contractDto.Scan = await fileDtosFactory.Create(contract.ScanName, contract.ScanContent);
        
        return contractDto;
    }
}