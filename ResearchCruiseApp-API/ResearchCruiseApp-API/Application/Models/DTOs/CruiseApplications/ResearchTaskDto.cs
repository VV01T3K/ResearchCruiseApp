using AutoMapper;
using ResearchCruiseApp_API.Application.Common.Models.DTOs;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class ResearchTaskDto
{
    public int Type { get; set; }
    
    public string? Title { get; init; }
        
    public string? Author { get; init; }
        
    public string? Institution { get; init; }
        
    public string? Date { get; init; }
        
    public StringRangeDto? Time { get; init; }
        
    public double? FinancingAmount { get; init; }
        
    public string? Description { get; init; }

    public bool? FinancingApproved { get; init; }
    
    
    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<FormAResearchTask, ResearchTaskDto>()
                .ForMember(
                    dest => dest.Type,
                    options =>
                        options.MapFrom(src => src.ResearchTask.Type))
                .ForMember(
                    dest => dest.Title,
                    options =>
                        options.MapFrom(src => src.ResearchTask.Title))
                .ForMember(
                    dest => dest.Author,
                    options =>
                        options.MapFrom(src => src.ResearchTask.Author))
                .ForMember(
                    dest => dest.Institution,
                    options =>
                        options.MapFrom(src => src.ResearchTask.Institution))
                .ForMember(
                    dest => dest.Date,
                    options =>
                        options.MapFrom(src => src.ResearchTask.Date))
                .ForMember(
                    dest => dest.Time,
                    options =>
                        options.MapFrom(src =>
                            src.ResearchTask.StartDate != null && src.ResearchTask.EndDate != null
                                ? new StringRangeDto { Start = src.ResearchTask.StartDate, End = src.ResearchTask.EndDate }
                                : (StringRangeDto?)null))
                .ForMember(
                    dest => dest.FinancingAmount,
                    options =>
                        options.MapFrom(src => src.ResearchTask.FinancingAmount))
                .ForMember(
                    dest => dest.Description,
                    options =>
                        options.MapFrom(src => src.ResearchTask.Description))
                .ForMember(
                    dest => dest.FinancingApproved,
                    options =>
                        options.MapFrom(src => src.ResearchTask.FinancingApproved));

            CreateMap<ResearchTask, ResearchTaskDto>();
            
            CreateMap<ResearchTaskDto, ResearchTask>()
                .ForMember(
                    dest => dest.StartDate,
                    options =>
                        options.MapFrom(src => src.Time.HasValue
                            ? src.Time.Value.Start
                            : null))
                .ForMember(
                    dest => dest.EndDate,
                    options =>
                        options.MapFrom(src => src.Time.HasValue
                            ? src.Time.Value.End
                            : null))
                .ForMember(
                    dest => dest.EndDate,
                    options =>
                        options.MapFrom(src => src.Time.HasValue
                            ? src.Time.Value.End
                            : null));
        }
    }
}