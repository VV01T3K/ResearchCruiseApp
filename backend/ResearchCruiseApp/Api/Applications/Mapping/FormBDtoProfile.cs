using AutoMapper;
using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Mapping;

internal class FormBDtoProfile : Profile
{
    public FormBDtoProfile()
    {
        CreateMap<FormBDto, FormB>()
            .ForAllMembers(options =>
            {
                if (options.DestinationMember.Name != nameof(FormB.IsCruiseManagerPresent))
                    options.Ignore();
            });

        CreateMap<FormB, FormBDto>()
            .ForMember(dest => dest.Permissions, options => options.Ignore()) // Member requires complex logic
            .ForMember(dest => dest.UgTeams, options => options.MapFrom(src => src.FormBUgUnits))
            .ForMember(
                dest => dest.GuestTeams,
                options => options.MapFrom(src => src.FormBGuestUnits)
            )
            .ForMember(
                dest => dest.ShortResearchEquipments,
                options => options.MapFrom(src => src.FormBShortResearchEquipments)
            )
            .ForMember(
                dest => dest.LongResearchEquipments,
                options => options.MapFrom(src => src.FormBLongResearchEquipments)
            )
            .ForMember(dest => dest.Ports, options => options.MapFrom(src => src.FormBPorts))
            .ForMember(
                dest => dest.ResearchEquipments,
                options => options.MapFrom(src => src.FormBResearchEquipments)
            )
            .ForMember(
                dest => dest.ShipEquipmentsIds,
                options => options.MapFrom(src => src.ShipEquipments)
            );
    }
}
