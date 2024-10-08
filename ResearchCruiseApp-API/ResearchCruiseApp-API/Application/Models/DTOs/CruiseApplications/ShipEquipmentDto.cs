using System.ComponentModel.DataAnnotations;
using AutoMapper;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class ShipEquipmentDto
{
    public Guid Id { get; init; }
    
    
    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<ShipEquipment, ShipEquipmentDto>();
        }
    }
}