using AutoMapper;
using ResearchCruiseApp.Application.Models.DTOs.Cruises;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Models.Mapping.Cruises;


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