using AutoMapper;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class PublicationDto
{
    public string Category { get; set; } = null!;

    public string Doi { get; set; } = null!;

    public string Authors { get; set; } = null!;

    public string Title { get; set; } = null!;

    public string Magazine { get; set; } = null!;
    
    public int Year { get; set; }
    
    public int MinisterialPoints { get; set; }


    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<Publication, PublicationDto>()
                .ReverseMap();
        }
    }
}