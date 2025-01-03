using AutoMapper;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Models.Mapping.CruiseApplications;

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
