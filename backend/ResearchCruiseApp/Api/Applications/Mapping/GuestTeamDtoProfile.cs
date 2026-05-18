using AutoMapper;
using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Mapping;

internal class GuestTeamDtoProfile : Profile
{
    public GuestTeamDtoProfile()
    {
        CreateMap<GuestTeamDto, GuestUnit>()
            .ForMember(dest => dest.Id, options => options.Ignore())
            .ForMember(dest => dest.FormAGuestUnits, options => options.Ignore());

        CreateMap<FormAGuestUnit, GuestTeamDto>()
            .ForMember(dest => dest.Name, options => options.MapFrom(src => src.GuestUnit.Name));

        CreateMap<FormBGuestUnit, GuestTeamDto>()
            .ForMember(dest => dest.Name, options => options.MapFrom(src => src.GuestUnit.Name));

        CreateMap<FormCGuestUnit, GuestTeamDto>()
            .ForMember(dest => dest.Name, options => options.MapFrom(src => src.GuestUnit.Name));
    }
}
