using System.ComponentModel.DataAnnotations;
using AutoMapper;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class FormCDto
{
    [StringLength(1)]
    public string ShipUsage { get; init; } = null!;
    
    public List<PermissionDto> Permissions { get; init; } = [];
    
    public Guid ResearchAreaId { get; init; }
    
    public List<UgTeamDto> UgTeams { get; init; } = [];

    public List<GuestTeamDto> GuestTeams { get; init; } = [];

    public List<ResearchTaskEffectDto> ResearchTasksEffects { get; init; } = [];
    
    public List<ContractDto> Contracts { get; init; } = [];
    
    public List<SpubTaskDto> SpubTasks { get; init; } = [];
    
    public List<ShortResearchEquipmentDto> ShortResearchEquipments { get; init; } = [];
    
    public List<LongResearchEquipmentDto> LongResearchEquipments { get; init; } = [];
    
    public List<PortDto> Ports { get; init; } = [];
    
    public List<CruiseDayDetailsDto> CruiseDaysDetails { get; init; } = [];
    
    public List<ResearchEquipmentDto> ResearchEquipments { get; init; } = [];
    
    public List<Guid> ShipEquipmentsIds { get; init; } = [];

    public List<CollectedSampleDto> CollectedSamples { get; init; } = [];
    
    [StringLength(1024)]
    public string? SpubReportData { get; init; } = null!;
    
    [StringLength(1024)]
    public string? AdditionalDescription { get; init; } = null!;

    public List<FileDto> Photos { get; init; } = []!;


    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<FormCDto, FormC>()
                .ForAllMembers(options =>
                {
                    // They don't require complex logic
                    var mappedPropsNames = new List<string>
                    {
                        nameof(FormC.ShipUsage),
                        nameof(FormC.CollectedSamples),
                        nameof(FormC.SpubReportData),
                        nameof(FormC.AdditionalDescription)
                    };
                    
                    if (!mappedPropsNames.Contains(options.DestinationMember.Name))
                        options.Ignore();
                });
            
            CreateMap<FormC, FormCDto>()
                .ForMember(
                    dest => dest.Permissions,
                    options =>
                        options.Ignore()) // In progress
                .ForMember(
                    dest => dest.ResearchAreaId,
                    options =>
                        options.MapFrom(src => src.ResearchArea.Id))
                .ForMember(
                    dest => dest.UgTeams,
                    options =>
                        options.MapFrom(src => src.FormCUgUnits))
                .ForMember(
                    dest => dest.GuestTeams,
                    options =>
                        options.MapFrom(src => src.FormCGuestUnits))
                .ForMember(
                    dest => dest.ResearchTasksEffects,
                    options =>
                        options.MapFrom(src => src.ResearchTaskEffects))
                .ForMember(
                    dest => dest.Contracts,
                    options =>
                        options.Ignore()) // Member requires complex logic
                .ForMember(
                    dest => dest.ShortResearchEquipments,
                    options =>
                        options.MapFrom(src => src.FormCShortResearchEquipments))
                .ForMember(
                    dest => dest.LongResearchEquipments,
                    options =>
                        options.MapFrom(src => src.FormCLongResearchEquipments))
                .ForMember(
                    dest => dest.Ports,
                    options =>
                        options.MapFrom(src => src.FormCPorts))
                .ForMember(
                    dest => dest.ResearchEquipments,
                    options =>
                        options.MapFrom(src => src.FormCResearchEquipments))
                .ForMember(
                    dest => dest.ShipEquipmentsIds,
                    options =>
                        options.MapFrom(src => src.ShipEquipments))
                .ForMember(
                    dest => dest.Photos,
                    options =>
                        options.Ignore());  // Member requires complex logic
        }
    }
}