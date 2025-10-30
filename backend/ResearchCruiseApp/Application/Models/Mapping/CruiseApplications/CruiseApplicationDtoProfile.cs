using AutoMapper;
using ResearchCruiseApp.Application.Common.Extensions;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Models.Mapping.CruiseApplications;

internal class CruiseApplicationDtoProfile : Profile
{
    public CruiseApplicationDtoProfile()
    {
        CreateMap<CruiseApplication, CruiseApplicationDto>()
            .ForMember(
                dest => dest.Year,
                options => options.MapFrom(src => src.FormA != null ? src.FormA.Year : default)
            )
            .ForMember(
                dest => dest.CruiseManagerId,
                options =>
                    options.MapFrom(src =>
                        src.FormA != null ? src.FormA.CruiseManagerId : Guid.Empty
                    )
            )
            .ForMember(
                dest => dest.DeputyManagerId,
                options =>
                    options.MapFrom(src =>
                        src.FormA != null ? src.FormA.DeputyManagerId : Guid.Empty
                    )
            )
            .ForMember(dest => dest.HasFormA, options => options.MapFrom(src => src.FormA != null))
            .ForMember(dest => dest.HasFormB, options => options.MapFrom(src => src.FormB != null))
            .ForMember(dest => dest.HasFormC, options => options.MapFrom(src => src.FormC != null))
            .ForMember(
                dest => dest.Status,
                options => options.MapFrom(src => src.Status.GetStringValue())
            )
            .ForMember(
                dest => dest.CruiseHours,
                options => options.MapFrom(src => src.FormA != null ? src.FormA.CruiseHours : null)
            )
            .ForMember(
                dest => dest.AcceptablePeriodBeg,
                options =>
                    options.MapFrom(src => src.FormA != null ? src.FormA.AcceptablePeriodBeg : null)
            )
            .ForMember(
                dest => dest.AcceptablePeriodEnd,
                options =>
                    options.MapFrom(src => src.FormA != null ? src.FormA.AcceptablePeriodEnd : null)
            )
            .ForMember(
                dest => dest.OptimalPeriodBeg,
                options =>
                    options.MapFrom(src => src.FormA != null ? src.FormA.OptimalPeriodBeg : null)
            )
            .ForMember(
                dest => dest.OptimalPeriodEnd,
                options =>
                    options.MapFrom(src => src.FormA != null ? src.FormA.OptimalPeriodEnd : null)
            )
            .ForMember(
                dest => dest.PrecisePeriodStart,
                options =>
                    options.MapFrom(src => src.FormA != null ? src.FormA.PrecisePeriodStart : null)
            )
            .ForMember(
                dest => dest.PrecisePeriodEnd,
                options =>
                    options.MapFrom(src => src.FormA != null ? src.FormA.PrecisePeriodEnd : null)
            )
            .ForMember(
                dest => dest.StartDate,
                options =>
                    options.MapFrom(
                        (src, dest) =>
                            src.Cruise != null && !string.IsNullOrEmpty(src.Cruise.StartDate)
                                ? DateTime.Parse(src.Cruise.StartDate)
                                : (DateTime?)null
                    )
            )
            .ForMember(
                dest => dest.EndDate,
                options =>
                    options.MapFrom(
                        (src, dest) =>
                            src.Cruise != null && !string.IsNullOrEmpty(src.Cruise.EndDate)
                                ? DateTime.Parse(src.Cruise.EndDate)
                                : (DateTime?)null
                    )
            );
    }
}
