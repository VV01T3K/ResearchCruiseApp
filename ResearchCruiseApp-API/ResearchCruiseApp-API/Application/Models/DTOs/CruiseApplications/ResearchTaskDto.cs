using AutoMapper;
using ResearchCruiseApp_API.Application.Common.Models.DTOs;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class ResearchTaskDto
{
    public string Type { get; set; }

    public string? Title { get; set; }
        
    public string? Author { get; set; }
        
    public string? Institution { get; set; }
        
    public string? Date { get; set; }
        
    public string? StartDate { get; set; }
    
    public string? EndDate { get; set; }
        
    public string? FinancingAmount { get; set; }
        
    public string? Description { get; set; }
    
    
    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<ResearchTask, ResearchTaskDto>()
                .ReverseMap();
        }
    }
}