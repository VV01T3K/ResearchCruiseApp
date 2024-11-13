using AutoMapper;
using ResearchCruiseApp_API.Application.Models.DTOs.Cruises;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.Mapping.Cruises;


internal class CruiseApplicationShortInfoDtoProfile : Profile
{
    public CruiseApplicationShortInfoDtoProfile()
    {
        CreateMap<CruiseApplication, CruiseApplicationShortInfoDto>()
            .ForMember(
                dest => dest.DeputyManagerId,
                options =>
                    options.MapFrom(src => src.FormA != null
                        ? src.FormA.DeputyManagerId
                        : Guid.Empty))
            .ForMember(
                dest => dest.CruiseManagerId,
                options =>
                    options.MapFrom(src => src.FormA != null
                        ? src.FormA.CruiseManagerId
                        : Guid.Empty))
            .ForMember(
                dest => dest.Points,
                options=>
                    options.Ignore());
    }
}