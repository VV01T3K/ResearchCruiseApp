using AutoMapper;
using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Mapping;

internal class ResearchAreaDtoProfile : Profile
{
    public ResearchAreaDtoProfile()
    {
        CreateMap<ResearchArea, ResearchAreaDto>();
    }
}
