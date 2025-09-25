using AutoMapper;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Models.Mapping.CruiseApplications;

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
