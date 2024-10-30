using System.ComponentModel.DataAnnotations;
using AutoMapper;
using ResearchCruiseApp_API.Application.Models.Interfaces;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class LongResearchEquipmentDto : IResearchEquipmentDto
{
    [StringLength(1024)]
    public string Name { get; init; } = null!;

    [StringLength(1024)]
    public string Action { get; init; } = null!;
    
    [StringLength(1024)]
    public string Duration { get; init; } = null!;
    
    
    private class MapProfile : Profile
    {
        public MapProfile()
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
}