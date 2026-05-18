using AutoMapper;
using ResearchCruiseApp.Api.Cruises.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Cruises.Mapping;

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
