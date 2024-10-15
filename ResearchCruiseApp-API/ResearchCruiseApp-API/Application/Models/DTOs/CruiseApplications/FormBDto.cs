using System.ComponentModel.DataAnnotations;
using AutoMapper;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class FormBDto
{
    [StringLength(1024)]
    public string IsCruiseManagerPresent { get; init; } = null!;

    public List<PermissionDto> Permissions { get; init; } = [];

    public List<UgTeamDto> UgTeams { get; init; } = [];

    public List<GuestTeamDto> GuestTeams { get; init; } = [];

    public List<CrewMemberDto> CrewMembers { get; init; } = [];

    public List<ShortResearchEquipmentDto> ShortResearchEquipments { get; init; } = [];

    public List<LongResearchEquipmentDto> LongResearchEquipments { get; init; } = [];

    public List<PortDto> Ports { get; init; } = [];

    public List<CruiseDayDetailsDto> CruiseDaysDetails { get; init; } = [];

    public List<ResearchEquipmentDto> ResearchEquipments { get; init; } = [];

    public List<Guid> ShipEquipmentsIds { get; init; } = [];

    
    private class MapProfile : Profile
    {
        public MapProfile()
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
                        options.Ignore()) // In progress
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
}