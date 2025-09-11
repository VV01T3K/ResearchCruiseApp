using AutoMapper;
using ResearchCruiseApp.Application.Models.DTOs.Cruises;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Models.Mapping.Cruises;

internal class CruiseBlockadePeriodDtoProfile : Profile
{
    public CruiseBlockadePeriodDtoProfile()
    {
        CreateMap<Cruise, CruiseBlockadePeriodDto>()
            .ForMember(dest => dest.StartDate, options => options.MapFrom(src => src.StartDate))
            .ForMember(dest => dest.EndDate, options => options.MapFrom(src => src.EndDate))
            .ForMember(dest => dest.Title, options => options.MapFrom(src => src.Title));
    }
}
