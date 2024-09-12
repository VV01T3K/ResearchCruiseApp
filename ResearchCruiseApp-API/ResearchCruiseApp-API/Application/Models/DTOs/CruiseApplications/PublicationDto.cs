using AutoMapper;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class PublicationDto
{
    public string Category { get; init; } = null!;

    public string Doi { get; init; } = null!;

    public string Authors { get; init; } = null!;

    public string Title { get; init; } = null!;

    public string Magazine { get; init; } = null!;
    
    public int Year { get; init; }
    
    public int MinisterialPoints { get; init; }


    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<PublicationDto, Publication>()
                .ForMember(
                    dest => dest.Id,
                    options =>
                        options.Ignore())
                .ForMember(
                    dest => dest.FormAPublications,
                    options =>
                        options.Ignore());

            CreateMap<Publication, PublicationDto>();
            
            CreateMap<FormAPublication, PublicationDto>()
                .ForMember(
                    dest => dest.Category,
                    options =>
                        options.MapFrom(src => src.Publication.Category))
                .ForMember(
                    dest => dest.Doi,
                    options =>
                        options.MapFrom(src => src.Publication.Doi))
                .ForMember(
                    dest => dest.Authors,
                    options =>
                        options.MapFrom(src => src.Publication.Authors))
                .ForMember(
                    dest => dest.Title,
                    options =>
                        options.MapFrom(src => src.Publication.Title))
                .ForMember(
                    dest => dest.Magazine,
                    options =>
                        options.MapFrom(src => src.Publication.Magazine))
                .ForMember(
                    dest => dest.Year,
                    options =>
                        options.MapFrom(src => src.Publication.Year))
                .ForMember(
                    dest => dest.MinisterialPoints,
                    options =>
                        options.MapFrom(src => src.Publication.MinisterialPoints));
        }
    }
}