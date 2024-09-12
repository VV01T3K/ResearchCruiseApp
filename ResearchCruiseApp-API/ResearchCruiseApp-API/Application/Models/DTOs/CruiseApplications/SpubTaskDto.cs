using AutoMapper;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class SpubTaskDto
{
    public string YearFrom { get; set; } = null!;
    public string YearTo { get; set; } = null!;
    public string Name { get; set; } = null!;
    
    
    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<SpubTask, SpubTaskDto>()
                .ReverseMap();
        }
    }
}