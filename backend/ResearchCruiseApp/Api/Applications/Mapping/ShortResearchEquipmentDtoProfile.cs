using AutoMapper;
using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Mapping;

internal class ShortResearchEquipmentDtoProfile : Profile
{
    public ShortResearchEquipmentDtoProfile()
    {
        CreateMap<FormBShortResearchEquipment, ShortResearchEquipmentDto>()
            .ForMember(
                dest => dest.Name,
                options => options.MapFrom(src => src.ResearchEquipment.Name)
            );

        CreateMap<FormCShortResearchEquipment, ShortResearchEquipmentDto>()
            .ForMember(
                dest => dest.Name,
                options => options.MapFrom(src => src.ResearchEquipment.Name)
            );
    }
}
