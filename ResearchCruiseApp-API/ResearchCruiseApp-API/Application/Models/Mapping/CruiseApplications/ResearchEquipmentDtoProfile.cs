using AutoMapper;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.Mapping.CruiseApplications;


internal class ResearchEquipmentDtoProfile : Profile
{
    public ResearchEquipmentDtoProfile()
    {
        CreateMap<FormBResearchEquipment, ResearchEquipmentDto>()
            .ForMember(
                dest => dest.Name,
                options =>
                    options.MapFrom(src => src.ResearchEquipment.Name));
            
        CreateMap<FormCResearchEquipment, ResearchEquipmentDto>()
            .ForMember(
                dest => dest.Name,
                options =>
                    options.MapFrom(src => src.ResearchEquipment.Name));
    }
}