using AutoMapper;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Models.Mapping.CruiseApplications;

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
