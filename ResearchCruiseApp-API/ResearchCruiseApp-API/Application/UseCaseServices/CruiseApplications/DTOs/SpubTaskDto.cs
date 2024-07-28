using AutoMapper;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.UseCaseServices.CruiseApplications.DTOs;


public class SpubTaskDto
{
    public int YearFrom { get; set; }
    public int YearTo { get; set; }
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