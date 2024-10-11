using System.ComponentModel.DataAnnotations;
using AutoMapper;
using ResearchCruiseApp_API.Application.Models.Interfaces;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class ResearchEquipmentDto : IResearchEquipmentDto
{
    [StringLength(1024)]
    public string Name { get; init; } = null!;
    
    [StringLength(1024)]
    public string? InsuranceStartDate { get; init; }
    
    [StringLength(1024)]
    public string? InsuranceEndDate { get; init; }

    [StringLength(1024)]
    public string Permission { get; init; } = null!;


    private class MapProfile : Profile
    {
        public MapProfile()
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
}