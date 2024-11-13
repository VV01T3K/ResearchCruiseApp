using AutoMapper;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.Mapping.CruiseApplications;


internal class UgTeamWithNameDtoProfile : Profile
{
    public UgTeamWithNameDtoProfile()
    {
        CreateMap<FormAUgUnit, UgTeamWithNameDto>()
            .ForMember(
                dest => dest.UgUnitName,
                options =>
                    options.MapFrom(src => src.UgUnit.Name));
    }
}