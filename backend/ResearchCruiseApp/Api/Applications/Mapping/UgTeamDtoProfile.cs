using AutoMapper;
using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Mapping;

internal class UgTeamDtoProfile : Profile
{
    public UgTeamDtoProfile()
    {
        CreateMap<FormAUgUnit, UgTeamDto>()
            .ForMember(dest => dest.UgUnitId, options => options.MapFrom(src => src.UgUnit.Id));

        CreateMap<FormBUgUnit, UgTeamDto>()
            .ForMember(dest => dest.UgUnitId, options => options.MapFrom(src => src.UgUnit.Id));

        CreateMap<FormCUgUnit, UgTeamDto>()
            .ForMember(dest => dest.UgUnitId, options => options.MapFrom(src => src.UgUnit.Id));
    }
}
