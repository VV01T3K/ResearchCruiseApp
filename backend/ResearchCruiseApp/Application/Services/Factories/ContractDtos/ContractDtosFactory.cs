using AutoMapper;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Application.Services.Factories.FileDtos;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.Factories.ContractDtos;

internal class ContractDtosFactory(IMapper mapper, IFileDtosFactory fileDtosFactory)
    : IContractDtosFactory
{
    public async Task<ContractDto> Create(Contract contract)
    {
        var contractDto = mapper.Map<ContractDto>(contract);

        contractDto.Scan = await fileDtosFactory.CreateFromCompressed(
            contract.ScanName,
            contract.ScanContent
        );

        return contractDto;
    }
}
