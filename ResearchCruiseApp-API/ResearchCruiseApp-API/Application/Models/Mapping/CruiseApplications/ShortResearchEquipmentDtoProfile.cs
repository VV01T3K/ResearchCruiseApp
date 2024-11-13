using AutoMapper;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.Mapping.CruiseApplications;


internal class ShortResearchEquipmentDtoProfile : Profile
{
    public ShortResearchEquipmentDtoProfile()
    {
        CreateMap<FormBShortResearchEquipment, ShortResearchEquipmentDto>()
            .ForMember(
                dest => dest.Name,
                options =>
                    options.MapFrom(src => src.ResearchEquipment.Name));
            
        CreateMap<FormCShortResearchEquipment, ShortResearchEquipmentDto>()
            .ForMember(
                dest => dest.Name,
                options =>
                    options.MapFrom(src => src.ResearchEquipment.Name));
    }
}