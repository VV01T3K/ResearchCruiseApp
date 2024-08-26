using AutoMapper;
using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Application.SharedServices.Compressor;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.GetFormA;


public class GetFormAHandler(
    ICompressor compressor,
    IMapper mapper,
    ICruiseApplicationsRepository cruiseApplicationsRepository)
    : IRequestHandler<GetFormAQuery, Result<FormADto>>
{
    public async Task<Result<FormADto>> Handle(GetFormAQuery request, CancellationToken cancellationToken)
    {
        var formA = await cruiseApplicationsRepository
            .GetFormAByCruiseApplicationId(request.ApplicationId, cancellationToken); 

        if (formA is null)
            return Error.NotFound();
        
        return await CreateFormADto(formA);
    }


    private async Task<FormADto> CreateFormADto(FormA formA)
    {
        var formADto = mapper.Map<FormADto>(formA);

        foreach (var contract in formA.Contracts)
        {
            formADto.Contracts.Add(await CreateContractDto(contract));
        }

        return formADto;
    }

    private async Task<ContractDto> CreateContractDto(Contract contract)
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