using AutoMapper;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Application.Services.Factories.ContractDtos;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.Factories.FormAContractDtos;


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