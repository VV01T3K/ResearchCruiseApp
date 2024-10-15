using AutoMapper;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class ShipEquipmentDto
{
    public Guid Id { get; init; }

    public string Name { get; init; } = null!;
    
    
    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<ShipEquipment, ShipEquipmentDto>();
        }
    }
}