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

        foreach (var scanDto in contractDto.Scans)
        {
            if (!string.IsNullOrEmpty(scanDto.Name) && !string.IsNullOrEmpty(scanDto.Content))
            {
                var contractFile = new ContractFile
                {
                    FileName = scanDto.Name,
                    FileContent = await compressor.Compress(scanDto.Content),
                };
                contract.Files.Add(contractFile);
            }
        }

        return contract;
    }
}
