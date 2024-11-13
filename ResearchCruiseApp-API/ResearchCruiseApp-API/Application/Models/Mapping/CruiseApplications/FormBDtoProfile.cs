using AutoMapper;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.Mapping.CruiseApplications;


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
            .ForMember(
                dest => dest.Permissions,
                options =>
                    options.Ignore()) // Member requires complex logic
            .ForMember(
                dest => dest.UgTeams,
                options =>
                    options.MapFrom(src => src.FormBUgUnits))
            .ForMember(
                dest => dest.GuestTeams,
                options =>
                    options.MapFrom(src => src.FormBGuestUnits))
            .ForMember(
                dest => dest.ShortResearchEquipments,
                options =>
                    options.MapFrom(src => src.FormBShortResearchEquipments))
            .ForMember(
                dest => dest.LongResearchEquipments,
                options =>
                    options.MapFrom(src => src.FormBLongResearchEquipments))
            .ForMember(
                dest => dest.Ports,
                options =>
                    options.MapFrom(src => src.FormBPorts))
            .ForMember(
                dest => dest.ResearchEquipments,
                options =>
                    options.MapFrom(src => src.FormBResearchEquipments))
            .ForMember(
                dest => dest.ShipEquipmentsIds,
                options =>
                    options.MapFrom(src => src.ShipEquipments));
    }
}