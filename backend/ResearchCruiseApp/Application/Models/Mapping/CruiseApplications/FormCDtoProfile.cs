using AutoMapper;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Models.Mapping.CruiseApplications;

internal class FormCDtoProfile : Profile
{
    public FormCDtoProfile()
    {
        CreateMap<FormCDto, FormC>()
            .ForAllMembers(options =>
            {
                // They don't require complex logic
                var mappedPropsNames = new List<string>
                {
                    nameof(FormC.ShipUsage),
                    nameof(FormC.DifferentUsage),
                    nameof(FormC.CollectedSamples),
                    nameof(FormC.SpubReportData),
                    nameof(FormC.AdditionalDescription),
                };

                if (!mappedPropsNames.Contains(options.DestinationMember.Name))
                    options.Ignore();
            });

        CreateMap<FormC, FormCDto>()
            .ForMember(dest => dest.Permissions, options => options.Ignore()) // In progress
            .ForMember(
                dest => dest.ResearchAreaDescriptions,
                options => options.MapFrom(src => src.ResearchAreaDescriptions)
            )
            .ForMember(dest => dest.UgTeams, options => options.MapFrom(src => src.FormCUgUnits))
            .ForMember(
                dest => dest.GuestTeams,
                options => options.MapFrom(src => src.FormCGuestUnits)
            )
            .ForMember(
                dest => dest.ResearchTasksEffects,
                options => options.MapFrom(src => src.ResearchTaskEffects)
            )
            .ForMember(dest => dest.Contracts, options => options.Ignore()) // Member requires complex logic
            .ForMember(
                dest => dest.ShortResearchEquipments,
                options => options.MapFrom(src => src.FormCShortResearchEquipments)
            )
            .ForMember(
                dest => dest.LongResearchEquipments,
                options => options.MapFrom(src => src.FormCLongResearchEquipments)
            )
            .ForMember(dest => dest.Ports, options => options.MapFrom(src => src.FormCPorts))
            .ForMember(
                dest => dest.ResearchEquipments,
                options => options.MapFrom(src => src.FormCResearchEquipments)
            )
            .ForMember(
                dest => dest.ShipEquipmentsIds,
                options => options.MapFrom(src => src.ShipEquipments)
            )
            .ForMember(dest => dest.Photos, options => options.Ignore()); // Member requires complex logic
    }
}
