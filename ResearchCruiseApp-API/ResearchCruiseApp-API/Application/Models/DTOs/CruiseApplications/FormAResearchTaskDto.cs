using AutoMapper;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class FormAResearchTaskDto
{
    public Guid Id { get; init; }
    
    public ResearchTaskDto ResearchTask { get; init; } = null!;

    public string Points { get; init; } = "0";


    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<FormAResearchTask, FormAResearchTaskDto>();
        }
    }
}