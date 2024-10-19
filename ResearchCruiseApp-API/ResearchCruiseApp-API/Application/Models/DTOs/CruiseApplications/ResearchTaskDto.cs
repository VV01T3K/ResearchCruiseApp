using AutoMapper;
using ResearchCruiseApp_API.Application.Models.Interfaces;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class ResearchTaskDto : IResearchTaskDto
{
    public string Type { get; init; } = null!;

    public string? Title { get; init; }
        
    public string? Author { get; init; }
        
    public string? Institution { get; init; }
        
    public string? Date { get; init; }
        
    public string? StartDate { get; init; }
    
    public string? EndDate { get; init; }
        
    public string? FinancingAmount { get; init; }
    
    public string? FinancingApproved { get; init; }
        
    public string? Description { get; init; }

    public string? SecuredAmount { get; init; }

    public string? MinisterialPoints { get; init; }
    
    private class MapProfile : Profile
    {
        public MapProfile()
        {
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
                    dest => dest.FinancingApproved,
                    options =>
                        options.MapFrom(src => src.ResearchTask.FinancingApproved))
                .ForMember(
                    dest => dest.Description,
                    options =>
                        options.MapFrom(src => src.ResearchTask.Description))
                .ForMember(
                    dest => dest.SecuredAmount,
                    options =>
                        options.MapFrom(src => src.ResearchTask.SecuredAmount))
                .ForMember(
                    dest => dest.MinisterialPoints,
                    options =>
                        options.MapFrom(src => src.ResearchTask.MinisterialPoints));
            
            CreateMap<ResearchTask, ResearchTaskDto>()
                .ForMember(
                    dest => dest.Type,
                    options =>
                        options.MapFrom(src => ((int)src.Type).ToString()));
        }
    }
}