using AutoMapper;
using ResearchCruiseApp_API.Application.Common.Extensions;
using ResearchCruiseApp_API.Application.Models.DTOs.Cruises;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.Mapping.Cruises;


internal class CruiseDtoProfile : Profile
{
    public CruiseDtoProfile()
    {
        CreateMap<Cruise, CruiseDto>()
            .ForMember(
                dest => dest.Status,
                options =>
                    options.MapFrom(src =>
                        src.Status.GetStringValue()
                    ))
            .ForMember(
                dest => dest.CruiseApplicationsShortInfo,
                options =>
                    options.Ignore());
    }
}