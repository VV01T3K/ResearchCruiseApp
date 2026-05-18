using AutoMapper;
using ResearchCruiseApp.Api.Cruises.Contracts;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Domain.Logic;

namespace ResearchCruiseApp.Api.Cruises.Mapping;

internal class CruiseDtoProfile : Profile
{
    public CruiseDtoProfile()
    {
        CreateMap<Cruise, CruiseDto>()
            .ForMember(dest => dest.Status, options => options.MapFrom(src => src.Status.ToCode()))
            .ForMember(dest => dest.CruiseApplicationsShortInfo, options => options.Ignore());
    }
}
