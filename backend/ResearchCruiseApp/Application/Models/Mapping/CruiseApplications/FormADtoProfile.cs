using AutoMapper;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Models.Mapping.CruiseApplications;

internal class FormADtoProfile : Profile
{
    public FormADtoProfile()
    {
        CreateMap<FormA, FormADto>()
            .ForMember(
                dest => dest.DeputyManagerId,
                options =>
                    options.MapFrom(src =>
                        src.DeputyManagerId == Guid.Empty ? (Guid?)null : src.DeputyManagerId
                    )
            )
            .ForMember(
                dest => dest.AcceptablePeriod,
                options =>
                    options.MapFrom(src => new HashSet<string>
                    {
                        src.AcceptablePeriodBeg,
                        src.AcceptablePeriodEnd,
                    })
            )
            .ForMember(
                dest => dest.OptimalPeriod,
                options =>
                    options.MapFrom(src => new HashSet<string>
                    {
                        src.OptimalPeriodBeg,
                        src.OptimalPeriodEnd,
                    })
            )
            .ForMember(dest => dest.Permissions, options => options.Ignore()) // Member requires complex logic
            .ForMember(
                dest => dest.ResearchAreaId,
                options =>
                    options.MapFrom(src =>
                        src.ResearchArea == null ? (Guid?)null : src.ResearchArea.Id
                    )
            )
            .ForMember(
                dest => dest.ResearchTasks,
                options => options.MapFrom(src => src.FormAResearchTasks)
            )
            .ForMember(dest => dest.Contracts, options => options.Ignore()) // Member requires complex logic
            .ForMember(dest => dest.UgTeams, options => options.MapFrom(src => src.FormAUgUnits))
            .ForMember(
                dest => dest.GuestTeams,
                options => options.MapFrom(src => src.FormAGuestUnits)
            )
            .ForMember(
                dest => dest.Publications,
                options => options.MapFrom(src => src.FormAPublications)
            )
            .ForMember(
                dest => dest.SpubTasks,
                options => options.MapFrom(src => src.FormASpubTasks)
            );

        CreateMap<FormADto, FormA>()
            .ForMember(dest => dest.Id, options => options.Ignore()) // Member auto-generated
            .ForMember(dest => dest.CruiseManagerId, options => options.Ignore()) // Member requires complex logic
            .ForMember(dest => dest.DeputyManagerId, options => options.Ignore()) // Member requires complex logic
            .ForMember(
                dest => dest.AcceptablePeriodBeg,
                options =>
                    options.MapFrom(src => src.AcceptablePeriod.Select(int.Parse).Min().ToString())
            )
            .ForMember(
                dest => dest.AcceptablePeriodEnd,
                options =>
                    options.MapFrom(src => src.AcceptablePeriod.Select(int.Parse).Max().ToString())
            )
            .ForMember(
                dest => dest.OptimalPeriodBeg,
                options =>
                    options.MapFrom(src => src.OptimalPeriod.Select(int.Parse).Min().ToString())
            )
            .ForMember(
                dest => dest.OptimalPeriodEnd,
                options =>
                    options.MapFrom(src => src.OptimalPeriod.Select(int.Parse).Max().ToString())
            )
            .ForMember(dest => dest.ResearchArea, options => options.Ignore()) // Member requires complex logic
            .ForMember(dest => dest.Permissions, options => options.Ignore()) // Member requires complex logic
            .ForMember(dest => dest.FormAResearchTasks, options => options.Ignore()) // Member requires complex logic
            .ForMember(dest => dest.FormAContracts, options => options.Ignore()) // Member requires complex logic
            .ForMember(dest => dest.FormAUgUnits, options => options.Ignore()) // Member requires complex logic
            .ForMember(dest => dest.UgUnitsPoints, options => options.Ignore()) // Member requires complex logic
            .ForMember(dest => dest.FormAGuestUnits, options => options.Ignore()) // Member requires complex logic
            .ForMember(dest => dest.FormAPublications, options => options.Ignore()) // Member requires complex logic
            .ForMember(dest => dest.FormASpubTasks, options => options.Ignore()); // Member requires complex logic
    }
}
