using AutoMapper;
using ResearchCruiseApp_API.Application.Common.DTOs;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.UseCaseServices.CruiseApplications.DTOs;


public class ResearchTaskValuesDto
{
    public string? Title { get; set; }
        
    public string? Author { get; set; }
        
    public string? Institution { get; set; }
        
    public string? Date { get; set; }
        
    public StringRangeDto? Time { get; set; }
        
    public double? FinancingAmount { get; set; }
        
    public string? Description { get; set; }
    
    
    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<ResearchTask, ResearchTaskValuesDto>()
                .ForMember(
                    dest => dest.Time,
                    options =>
                        options.MapFrom(src =>
                            src.StartDate != null && src.EndDate != null
                                ? new StringRangeDto{ Start = src.StartDate, End = src.EndDate }
                                : (StringRangeDto?)null));
        }
    }
}