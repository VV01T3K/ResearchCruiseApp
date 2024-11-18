using AutoMapper;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.Mapping.Other;


internal class GuidMapProfile : Profile
{
    public GuidMapProfile()
    {
        CreateMap<ShipEquipment, Guid>()
            .ConstructUsing(src => src.Id);
    }
}