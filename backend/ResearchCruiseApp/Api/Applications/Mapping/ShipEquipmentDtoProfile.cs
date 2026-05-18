using AutoMapper;
using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Mapping;

internal class ShipEquipmentDtoProfile : Profile
{
    public ShipEquipmentDtoProfile()
    {
        CreateMap<ShipEquipment, ShipEquipmentDto>();
    }
}
