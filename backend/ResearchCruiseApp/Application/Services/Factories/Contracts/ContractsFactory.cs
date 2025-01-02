using AutoMapper;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.Factories.Contracts;


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