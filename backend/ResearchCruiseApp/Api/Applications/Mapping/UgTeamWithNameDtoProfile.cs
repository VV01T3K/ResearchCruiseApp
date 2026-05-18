using AutoMapper;
using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Mapping;

internal class UgTeamWithNameDtoProfile : Profile
{
    public UgTeamWithNameDtoProfile()
    {
        CreateMap<FormAUgUnit, UgTeamWithNameDto>()
            .ForMember(dest => dest.UgUnitName, options => options.MapFrom(src => src.UgUnit.Name));
    }
}
