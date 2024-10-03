using AutoMapper;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class ResearchTaskDto
{
    public string Type { get; set; } = null!;

    public string? Title { get; set; }
        
    public string? Author { get; set; }
        
    public string? Institution { get; set; }
        
    public string? Date { get; set; }
        
    public string? StartDate { get; set; }
    
    public string? EndDate { get; set; }
        
    public string? FinancingAmount { get; set; }
    
    public string? FinancingApproved { get; init; }
        
    public string? Description { get; set; }
    
    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<ResearchTask, ResearchTaskDto>()                .ForMember(
                dest => dest.Type,
                options =>
                    options.MapFrom(src => ((int)src.Type).ToString()));
            CreateMap<FormAResearchTask, ResearchTaskDto>()
                .ForMember(
                    dest => dest.Type,
                    options =>
                        options.MapFrom(src => ((int)src.ResearchTask.Type).ToString()))
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
                    dest => dest.StartDate,
                    options =>
                        options.MapFrom(src =>
                            src.ResearchTask.StartDate))
                .ForMember(
                    dest => dest.EndDate,
                    options =>
                        options.MapFrom(src =>
                            src.ResearchTask.EndDate))
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
            
            CreateMap<ResearchTaskDto, ResearchTask>();
        }
    }
}