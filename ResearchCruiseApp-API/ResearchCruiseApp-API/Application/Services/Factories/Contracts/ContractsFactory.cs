using AutoMapper;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.Factories.Contracts;


internal class ContractsFactory(IMapper mapper, ICompressor compressor) : IContractsFactory
{
    public async Task<Contract> Create(ContractDto contractDto)
    {
        var contract = mapper.Map<Contract>(contractDto);
        
        contract.ScanName = contractDto.Scan.Name;
        contract.ScanContent = await compressor.Compress(contractDto.Scan.Content);

        return contract;
    }
}