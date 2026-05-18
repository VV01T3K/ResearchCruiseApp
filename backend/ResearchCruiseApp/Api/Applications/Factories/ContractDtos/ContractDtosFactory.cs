using AutoMapper;
using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Api.Applications.Factories.FileDtos;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Factories.ContractDtos;

internal class ContractDtosFactory(IMapper mapper, IFileDtosFactory fileDtosFactory)
    : IContractDtosFactory
{
    public async Task<ContractDto> Create(Contract contract)
    {
        var contractDto = mapper.Map<ContractDto>(contract);

        foreach (var file in contract.Files)
        {
            if (string.IsNullOrEmpty(file.FileName) || file.FileContent == null)
            {
                continue;
            }
            var fileDto = await fileDtosFactory.CreateFromCompressed(
                file.FileName,
                file.FileContent
            );
            contractDto.Scans.Add(fileDto);
        }

        return contractDto;
    }
}
