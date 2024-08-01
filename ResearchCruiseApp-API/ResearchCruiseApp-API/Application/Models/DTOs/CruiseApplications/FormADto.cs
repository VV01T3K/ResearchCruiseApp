using System.ComponentModel.DataAnnotations;
using AutoMapper;
using ResearchCruiseApp_API.Application.Common.Constants;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class FormADto
{
    [RegularExpression(@"^[0-9A-Fa-f]{8}-([0-9A-Fa-f]{4}-){3}[0-9A-Fa-f]{12}$")]
    public Guid? Id { get; set; }

    [RegularExpression(@"^[0-9A-Fa-f]{8}-([0-9A-Fa-f]{4}-){3}[0-9A-Fa-f]{12}$")]
    public Guid CruiseManagerId { get; set; }
    
    [RegularExpression(@"^[0-9A-Fa-f]{8}-([0-9A-Fa-f]{4}-){3}[0-9A-Fa-f]{12}$")]
    public Guid DeputyManagerId { get; set; }
    
    [Range(2024, 2050)]
    public int Year { get; set; }
    
    [Length(2,2)]
    public HashSet<int> AcceptablePeriod { get; set; } = [];
    
    [Length(2,2)]
    public HashSet<int> OptimalPeriod { get; set; } = [];
    
    [Range(0, int.MaxValue)]
    public int CruiseHours { get; set; }

    [Range(0, double.MaxValue)]
    public double? CruiseDays { get; set; }
    
    [StringLength(1024)]
    public string? PeriodNotes { get; set; }
    
    [Range(0,4)]
    public int ShipUsage { get; set; }
    
    [MaxLength(1024)]
    public string? DifferentUsage { get; set; }
    
    public int PermissionsRequired { get; set; }
    
    [MaxLength(1024)]
    public string? Permissions { get; set; }
    
    [Range(0,20)]
    public int ResearchArea { get; set; }
    
    [MaxLength(1024)]
    public string? ResearchAreaInfo { get; set; }
    
    public int CruiseGoal { get; set; }
    
    [MaxLength(1024)]
    public string? CruiseGoalDescription { get; set; }

    public List<ResearchTaskDto> ResearchTasks { get; set; } = [];

    public List<ContractDto> Contracts { get; set; } = [];

    public List<UgTeamDto> UgTeams { get; set; } = [];

    public List<GuestTeamDto> GuestTeams { get; set; } = [];

    public List<PublicationDto> Publications { get; set; } = [];

    public List<ThesisDto> Theses { get; set; } = [];

    public List<SpubTaskDto> SpubTasks { get; set; } = [];


    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<FormA, FormADto>()
                .ForMember(
                    dest => dest.CruiseManagerId,
                    options =>
                        options.MapFrom(src =>
                            src.CruiseManager.Id))
                .ForMember(
                    dest => dest.DeputyManagerId,
                    options =>
                        options.MapFrom(src =>
                            src.DeputyManager.Id))
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
                            src.CruiseHours / TimeConstants.HoursPerDay));
            
            // CruiseManager and DeputyManager mappings are complex and have to be performed in the business logic
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
                            src.OptimalPeriod.Max()));

        }
    }
}