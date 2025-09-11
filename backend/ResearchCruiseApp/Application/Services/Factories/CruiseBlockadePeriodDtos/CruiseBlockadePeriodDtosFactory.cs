using AutoMapper;
using ResearchCruiseApp.Application.Models.DTOs.Cruises;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.Factories.CruiseBlockadePeriodDtos;

internal class CruiseBlockadePeriodDtosFactory(IMapper mapper) : ICruiseBlockadePeriodDtosFactory
{
    public Task<CruiseBlockadePeriodDto> Create(Cruise cruise)
    {
        var dto = mapper.Map<CruiseBlockadePeriodDto>(cruise);
        return Task.FromResult(dto);
    }
}
