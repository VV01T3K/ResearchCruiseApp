using AutoMapper;
using ResearchCruiseApp_API.Application.Models.DTOs.Cruises;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.Mapping.Cruises;


internal class CruiseFormDtoProfile : Profile
{
    public CruiseFormDtoProfile()
    {
        CreateMap<CruiseFormDto, Cruise>()
            .ForMember(
                dest => dest.MainCruiseManagerId,
                options =>
                    options.MapFrom(src =>
                        src.ManagersTeam.MainCruiseManagerId))
            .ForMember(
                dest => dest.MainDeputyManagerId,
                options =>
                    options.MapFrom(src =>
                        src.ManagersTeam.MainDeputyManagerId))
            .ForMember(
                dest => dest.Number,
                options =>
                    options.MapFrom(src => string.Empty));
    }
}