using AutoMapper;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class FormASpubTaskDto
{
    public Guid Id { get; init; }

    public SpubTaskDto SpubTask { get; init; } = null!;
    
    public int Points { get; init; }
    
    
    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<FormASpubTask, FormASpubTaskDto>();
        }
    }
}