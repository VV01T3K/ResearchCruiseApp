using System.ComponentModel.DataAnnotations;
using AutoMapper;
using ResearchCruiseApp_API.Application.Common.Constants;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class FormADto
{
    [RegularExpression(@"^[0-9A-Fa-f]{8}-([0-9A-Fa-f]{4}-){3}[0-9A-Fa-f]{12}$")]
    public Guid? Id { get; init; }

    [RegularExpression(@"^[0-9A-Fa-f]{8}-([0-9A-Fa-f]{4}-){3}[0-9A-Fa-f]{12}$")]
    public Guid CruiseManagerId { get; init; }
    
    [RegularExpression(@"^[0-9A-Fa-f]{8}-([0-9A-Fa-f]{4}-){3}[0-9A-Fa-f]{12}$")]
    public Guid DeputyManagerId { get; init; }
    
    [Range(2024, 2050)]
    public int Year { get; init; }
    
    [Length(2,2)]
    public HashSet<int> AcceptablePeriod { get; init; } = [];
    
    [Length(2,2)]
    public HashSet<int> OptimalPeriod { get; init; } = [];
    
    [Range(0, int.MaxValue)]
    public int CruiseHours { get; init; }

    [Range(0, double.MaxValue)]
    public double? CruiseDays { get; init; }
    
    [StringLength(1024)]
    public string? PeriodNotes { get; init; }
    
    [Range(0,4)]
    public int ShipUsage { get; init; }
    
    [MaxLength(1024)]
    public string? DifferentUsage { get; init; }
    
    public int PermissionsRequired { get; init; }
    
    [MaxLength(1024)]
    public string? Permissions { get; init; }
    
    [Range(0,20)]
    public int ResearchArea { get; init; }
    
    [MaxLength(1024)]
    public string? ResearchAreaInfo { get; init; }
    
    public int CruiseGoal { get; init; }
    
    [MaxLength(1024)]
    public string? CruiseGoalDescription { get; init; }

    public List<ResearchTaskDto> ResearchTasks { get; init; } = [];

    public List<ContractDto> Contracts { get; init; } = [];

    public List<UgTeamDto> UgTeams { get; init; } = [];

    public List<GuestTeamDto> GuestTeams { get; init; } = [];

    public List<PublicationDto> Publications { get; init; } = [];

    public List<ThesisDto> Theses { get; init; } = [];

    public List<SpubTaskDto> SpubTasks { get; init; } = [];

    [MaxLength(1024)]
    public string? SupervisorEmail { get; init; }


    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<FormA, FormADto>()
                .ForMember(
                    dest => dest.AcceptablePeriod,
                    options =>
                        options.MapFrom(src =>
                            new HashSet<int> { src.AcceptablePeriodBeg, src.AcceptablePeriodEnd }))
                .ForMember(
                    dest => dest.OptimalPeriod,
                    options =>
                        options.MapFrom(src =>
                            new HashSet<int> { src.OptimalPeriodBeg, src.OptimalPeriodEnd }))
                .ForMember(
                    dest => dest.CruiseDays,
                    options =>
                        options.MapFrom(src =>
                            src.CruiseHours / TimeConstants.HoursPerDay))
                .ForMember(
                    dest => dest.Contracts,
                    options =>
                        options.Ignore()); // Mapping requires additional async operations

            CreateMap<FormADto, FormA>()
                .ForMember(
                    dest => dest.Id,
                    options =>
                        options.Ignore())
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
                    dest => dest.Contracts,
                    options =>
                        options.Ignore()); // Mapping requires additional async operations
        }
    }
}