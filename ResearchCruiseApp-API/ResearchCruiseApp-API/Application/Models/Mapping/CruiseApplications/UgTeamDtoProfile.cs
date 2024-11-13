using AutoMapper;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.Mapping.CruiseApplications;


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