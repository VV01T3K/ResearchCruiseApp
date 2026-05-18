using AutoMapper;
using ResearchCruiseApp.Api.Cruises.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Cruises.Mapping;

internal class CruiseApplicationShortInfoDtoProfile : Profile
{
    public CruiseApplicationShortInfoDtoProfile()
    {
        CreateMap<CruiseApplication, CruiseApplicationShortInfoDto>()
            .ForMember(
                dest => dest.DeputyManagerId,
                options =>
                    options.MapFrom(src =>
                        src.FormA != null ? src.FormA.DeputyManagerId : Guid.Empty
                    )
            )
            .ForMember(
                dest => dest.CruiseManagerId,
                options =>
                    options.MapFrom(src =>
                        src.FormA != null ? src.FormA.CruiseManagerId : Guid.Empty
                    )
            )
            .ForMember(dest => dest.Points, options => options.Ignore());
    }
}
