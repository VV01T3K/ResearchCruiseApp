using AutoMapper;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Models.Mapping.CruiseApplications;


internal class UgTeamDtoProfile : Profile
{
    public UgTeamDtoProfile()
    {
        CreateMap<FormAUgUnit, UgTeamDto>()
            .ForMember(
                dest => dest.UgUnitId,
                options =>
                    options.MapFrom(src => src.UgUnit.Id));
            
        CreateMap<FormBUgUnit, UgTeamDto>()
            .ForMember(
                dest => dest.UgUnitId,
                options =>
                    options.MapFrom(src => src.UgUnit.Id));
            
        CreateMap<FormCUgUnit, UgTeamDto>()
            .ForMember(
                dest => dest.UgUnitId,
                options =>
                    options.MapFrom(src => src.UgUnit.Id));
    }
}