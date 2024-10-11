using System.ComponentModel.DataAnnotations;
using AutoMapper;
using ResearchCruiseApp_API.Application.Models.Interfaces;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class ShortResearchEquipmentDto : IResearchEquipmentDto
{
    [StringLength(1024)]
    public string Name { get; init; } = null!;
    
    [StringLength(1024)]
    public string StartDate { get; init; } = null!;

    [StringLength(1024)]
    public string EndDate { get; init; } = null!;


    private class MapProfile : Profile
    {
        public MapProfile()
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
}