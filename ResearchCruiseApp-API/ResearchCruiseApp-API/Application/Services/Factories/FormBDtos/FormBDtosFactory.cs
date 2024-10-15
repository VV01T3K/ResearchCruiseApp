using AutoMapper;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.Factories.FormBDtos;


public class FormBDtosFactory(IMapper mapper) : IFormBDtosFactory
{
    public FormBDto Create(FormB formB, CancellationToken cancellationToken)
    {
        var formBDto = mapper.Map<FormBDto>(formB);
        
        return formBDto;
    }
}