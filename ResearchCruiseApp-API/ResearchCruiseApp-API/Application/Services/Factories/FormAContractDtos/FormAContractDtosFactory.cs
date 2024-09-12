using AutoMapper;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Application.Services.Factories.ContractDtos;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.Factories.FormAContractDtos;


public class FormAContractDtosFactory(
    IContractDtosFactory contractDtosFactory,
    IMapper mapper)
    : IFormAContractDtosFactory
{
    public async Task<FormAContractDto> Create(FormAContract formAContract)
    {
        var formAContractDto = mapper.Map<FormAContractDto>(formAContract);
        
        formAContractDto.Contract = await contractDtosFactory.Create(formAContract.Contract);

        return formAContractDto;
    }
}