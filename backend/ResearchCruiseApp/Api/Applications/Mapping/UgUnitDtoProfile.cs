using AutoMapper;
using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Mapping;

internal class UgUnitDtoProfile : Profile
{
    public UgUnitDtoProfile()
    {
        CreateMap<UgUnit, UgUnitDto>();
    }
}
