using AutoMapper;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Application.SharedServices.Factories.Contracts;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.SharedServices.Factories.FormsA;


internal class FormsAFactory(IMapper mapper, IContractsFactory contractsFactory) : IFormsAFactory
{
    public async Task<FormA> Create(FormADto formADto)
    {
        var formA = mapper.Map<FormA>(formADto);
        
        foreach (var contractDto in formADto.Contracts)
        {
            formA.Contracts.Add(await contractsFactory.Create(contractDto));
        }

        return formA;
    }
}