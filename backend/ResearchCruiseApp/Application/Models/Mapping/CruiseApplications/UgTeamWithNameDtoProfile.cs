using AutoMapper;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Models.Mapping.CruiseApplications;


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