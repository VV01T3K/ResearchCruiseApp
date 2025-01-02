using AutoMapper;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Models.Mapping.CruiseApplications;


internal class LongResearchEquipmentDtoProfile : Profile
{
    public LongResearchEquipmentDtoProfile()
    {
        CreateMap<FormBLongResearchEquipment, LongResearchEquipmentDto>()
            .ForMember(
                dest => dest.Name,
                options =>
                    options.MapFrom(src => src.ResearchEquipment.Name));
            
        CreateMap<FormCLongResearchEquipment, LongResearchEquipmentDto>()
            .ForMember(
                dest => dest.Name,
                options =>
                    options.MapFrom(src => src.ResearchEquipment.Name))
            .ForMember(
                dest => dest.Action,
                options =>
                    options.MapFrom(src => ((int)src.Action).ToString()));
    }
}