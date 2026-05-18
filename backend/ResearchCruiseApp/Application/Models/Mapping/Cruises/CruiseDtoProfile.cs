using AutoMapper;
using ResearchCruiseApp.Application.Models.DTOs.Cruises;
using ResearchCruiseApp.Domain.Entities;
using ResearchCruiseApp.Domain.Logic;

namespace ResearchCruiseApp.Application.Models.Mapping.Cruises;

internal class CruiseDtoProfile : Profile
{
    public CruiseDtoProfile()
    {
        CreateMap<Cruise, CruiseDto>()
            .ForMember(dest => dest.Status, options => options.MapFrom(src => src.Status.ToCode()))
            .ForMember(dest => dest.CruiseApplicationsShortInfo, options => options.Ignore());
    }
}
