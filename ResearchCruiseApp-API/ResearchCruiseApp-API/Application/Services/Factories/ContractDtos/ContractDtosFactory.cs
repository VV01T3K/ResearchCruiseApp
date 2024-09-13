using AutoMapper;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.Factories.ContractDtos;


internal class ContractDtosFactory(IMapper mapper, ICompressor compressor) : IContractDtosFactory
{
    public async Task<ContractDto> Create(Contract contract)
    {
        var contractDto = mapper.Map<ContractDto>(contract);

        contractDto.Scan = new ScanDto
        {
            Name = contract.ScanName,
            Content = await compressor.Decompress(contract.ScanContent)
        };

        return contractDto;
    }
}