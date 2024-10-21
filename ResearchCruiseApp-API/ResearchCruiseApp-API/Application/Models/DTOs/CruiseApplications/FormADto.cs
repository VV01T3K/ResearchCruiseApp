using System.ComponentModel.DataAnnotations;
using AutoMapper;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class FormADto
{
    public Guid? Id { get; init; }

    public Guid CruiseManagerId { get; init; }
    
    public Guid DeputyManagerId { get; init; }
    
    [StringLength(4)]
    public string Year { get; init; } = null!;
    
    [Length(2,2)]
    public HashSet<string> AcceptablePeriod { get; init; } = [];
    
    [Length(2,2)]
    public HashSet<string> OptimalPeriod { get; init; } = [];
    
    [StringLength(8)]
    public string CruiseHours { get; init; } = null!;
    
    [StringLength(1024)]
    public string? PeriodNotes { get; init; }
    
    [StringLength(1)]
    public string ShipUsage { get; init; } = null!;
    
    [MaxLength(1024)]
    public string? DifferentUsage { get; init; }

    public List<PermissionDto> Permissions { get; init; } = [];
    
    public Guid ResearchAreaId { get; init; }
    
    [MaxLength(1024)]
    public string? ResearchAreaInfo { get; init; }

    public string CruiseGoal { get; init; } = null!;
    
    [MaxLength(1024)]
    public string? CruiseGoalDescription { get; init; }

    public List<ResearchTaskDto> ResearchTasks { get; init; } = [];

    public List<ContractDto> Contracts { get; init; } = [];

    public List<UgTeamDto> UgTeams { get; init; } = [];

    public List<GuestTeamDto> GuestTeams { get; init; } = [];

    public List<PublicationDto> Publications { get; init; } = [];
    
    public List<SpubTaskDto> SpubTasks { get; init; } = [];

    [MaxLength(1024)]
    public string SupervisorEmail { get; init; } = null!;


    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<FormA, FormADto>()
                .ForMember(
                    dest => dest.AcceptablePeriod,
                    options =>
                        options.MapFrom(src =>
                            new HashSet<string> { src.AcceptablePeriodBeg, src.AcceptablePeriodEnd }))
                .ForMember(
                    dest => dest.OptimalPeriod,
                    options =>
                        options.MapFrom(src =>
                            new HashSet<string> { src.OptimalPeriodBeg, src.OptimalPeriodEnd }))
                .ForMember(
                    dest => dest.Permissions,
                    options =>
                        options.Ignore()) // Member requires complex logic
                .ForMember(
                    dest => dest.ResearchAreaId,
                    options =>
                        options.MapFrom(src => src.ResearchArea.Id))
                .ForMember(
                    dest => dest.ResearchTasks,
                    options =>
                        options.MapFrom(src => src.FormAResearchTasks))
                .ForMember(
                    dest => dest.Contracts,
                    options =>
                        options.Ignore()) // Member requires complex logic
                .ForMember(
                    dest => dest.UgTeams,
                    options =>
                        options.MapFrom(src => src.FormAUgUnits))
                .ForMember(
                    dest => dest.GuestTeams,
                    options =>
                        options.MapFrom(src => src.FormAGuestUnits))
                .ForMember(
                    dest => dest.Publications,
                    options =>
                        options.MapFrom(src => src.FormAPublications))
                .ForMember(
                    dest => dest.SpubTasks,
                    options =>
                        options.MapFrom(src => src.FormASpubTasks));

            CreateMap<FormADto, FormA>()
                .ForMember(
                    dest => dest.Id,
                    options =>
                        options.Ignore()) // Member auto-generated
                .ForMember(
                    dest => dest.AcceptablePeriodBeg,
                    options =>
                        options.MapFrom(src =>
                            src.AcceptablePeriod.Min()))
                .ForMember(
                    dest => dest.AcceptablePeriodEnd,
                    options =>
                        options.MapFrom(src =>
                            src.AcceptablePeriod.Max()))
                .ForMember(
                    dest => dest.OptimalPeriodBeg,
                    options =>
                        options.MapFrom(src =>
                            src.OptimalPeriod.Min()))
                .ForMember(
                    dest => dest.OptimalPeriodEnd,
                    options =>
                        options.MapFrom(src =>
                            src.OptimalPeriod.Max()))
                .ForMember(
                    dest => dest.ResearchArea,
                    options =>
                        options.Ignore()) // Member requires complex logic
                .ForMember(
                    dest => dest.Permissions,
                    options =>
                        options.Ignore()) // Member requires complex logic
                .ForMember(
                    dest => dest.FormAResearchTasks,
                    options =>
                        options.Ignore()) // Member requires complex logic
                .ForMember(
                    dest => dest.FormAContracts,
                    options =>
                        options.Ignore()) // Member requires complex logic
                .ForMember(
                    dest => dest.FormAUgUnits,
                    options =>
                        options.Ignore()) // Member requires complex logic
                .ForMember(
                    dest => dest.UgUnitsPoints,
                    options =>
                        options.Ignore()) // Member requires complex logic
                .ForMember(
                    dest => dest.FormAGuestUnits,
                    options =>
                        options.Ignore()) // Member requires complex logic
                .ForMember(
                    dest => dest.FormAPublications,
                    options =>
                        options.Ignore()) // Member requires complex logic
                .ForMember(
                    dest => dest.FormASpubTasks,
                    options =>
                        options.Ignore()); // Member requires complex logic
        }
    }
}