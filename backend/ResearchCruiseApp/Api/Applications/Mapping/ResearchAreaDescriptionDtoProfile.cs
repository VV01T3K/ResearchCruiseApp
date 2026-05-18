using AutoMapper;
using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Mapping;

internal class ResearchAreaDescriptionDtoProfile : Profile
{
    public ResearchAreaDescriptionDtoProfile()
    {
        CreateMap<ResearchAreaDescription, ResearchAreaDescriptionDto>();
        CreateMap<ResearchAreaDescriptionDto, ResearchAreaDescription>()
            .ForMember(dest => dest.Id, options => options.Ignore())
            .ForMember(dest => dest.FormsA, options => options.Ignore())
            .ForMember(dest => dest.FormsC, options => options.Ignore());
    }
}
