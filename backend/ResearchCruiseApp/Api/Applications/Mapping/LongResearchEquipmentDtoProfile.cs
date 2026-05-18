using AutoMapper;
using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Mapping;

internal class LongResearchEquipmentDtoProfile : Profile
{
    public LongResearchEquipmentDtoProfile()
    {
        CreateMap<FormBLongResearchEquipment, LongResearchEquipmentDto>()
            .ForMember(
                dest => dest.Name,
                options => options.MapFrom(src => src.ResearchEquipment.Name)
            );

        CreateMap<FormCLongResearchEquipment, LongResearchEquipmentDto>()
            .ForMember(
                dest => dest.Name,
                options => options.MapFrom(src => src.ResearchEquipment.Name)
            );
    }
}
