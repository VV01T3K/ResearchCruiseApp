using AutoMapper;
using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Mapping;

internal class ResearchEquipmentDtoProfile : Profile
{
    public ResearchEquipmentDtoProfile()
    {
        CreateMap<FormBResearchEquipment, ResearchEquipmentDto>()
            .ForMember(
                dest => dest.Name,
                options => options.MapFrom(src => src.ResearchEquipment.Name)
            );

        CreateMap<FormCResearchEquipment, ResearchEquipmentDto>()
            .ForMember(
                dest => dest.Name,
                options => options.MapFrom(src => src.ResearchEquipment.Name)
            );
    }
}
