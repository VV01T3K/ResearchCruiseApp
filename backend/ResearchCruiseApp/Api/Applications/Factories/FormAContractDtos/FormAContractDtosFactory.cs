using AutoMapper;
using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Api.Applications.Factories.ContractDtos;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Factories.FormAContractDtos;

public class FormAContractDtosFactory(IContractDtosFactory contractDtosFactory, IMapper mapper)
    : IFormAContractDtosFactory
{
    public async Task<FormAContractDto> Create(FormAContract formAContract)
    {
        var formAContractDto = mapper.Map<FormAContractDto>(formAContract);

        formAContractDto.Contract = await contractDtosFactory.Create(formAContract.Contract);

        return formAContractDto;
    }
}
