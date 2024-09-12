using AutoMapper;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Application.Services.Factories.ContractDtos;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.Factories.FormADtos;


internal class FormADtosFactory(IMapper mapper, IContractDtosFactory contractDtosFactory) : IFormADtosFactory
{
    public async Task<FormADto> Create(FormA formA)
    {
        var formADto = mapper.Map<FormADto>(formA);
        
        foreach (var formAContract in formA.FormAContracts)
        {
            var contract = formAContract.Contract;
            formADto.Contracts.Add(await contractDtosFactory.Create(contract));
        }
        
        return formADto;
    }
}