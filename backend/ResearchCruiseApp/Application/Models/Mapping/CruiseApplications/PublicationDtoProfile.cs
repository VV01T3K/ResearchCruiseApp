using AutoMapper;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Models.Mapping.CruiseApplications;

internal class PublicationDtoProfile : Profile
{
    public PublicationDtoProfile()
    {
        CreateMap<PublicationDto, Publication>()
            .ForMember(dest => dest.Id, options => options.Ignore())
            .ForMember(dest => dest.FormAPublications, options => options.Ignore());

        CreateMap<Publication, PublicationDto>();

        CreateMap<FormAPublication, PublicationDto>()
            .ForMember(
                dest => dest.Category,
                options => options.MapFrom(src => src.Publication.Category)
            )
            .ForMember(dest => dest.Doi, options => options.MapFrom(src => src.Publication.Doi))
            .ForMember(
                dest => dest.Authors,
                options => options.MapFrom(src => src.Publication.Authors)
            )
            .ForMember(dest => dest.Title, options => options.MapFrom(src => src.Publication.Title))
            .ForMember(
                dest => dest.Magazine,
                options => options.MapFrom(src => src.Publication.Magazine)
            )
            .ForMember(dest => dest.Year, options => options.MapFrom(src => src.Publication.Year))
            .ForMember(
                dest => dest.MinisterialPoints,
                options => options.MapFrom(src => src.Publication.MinisterialPoints)
            );
    }
}
