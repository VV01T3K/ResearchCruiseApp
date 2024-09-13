using AutoMapper;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class FormAPublicationDto
{
    public Guid Id { get; init; }

    public PublicationDto Publication { get; init; } = null!;
    
    public int Points { get; init; }


    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<FormAPublication, FormAPublicationDto>();
        }
    }
}