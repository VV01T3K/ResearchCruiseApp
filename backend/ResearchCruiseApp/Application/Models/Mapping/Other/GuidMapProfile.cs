using AutoMapper;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Models.Mapping.Other;


internal class GuidMapProfile : Profile
{
    public GuidMapProfile()
    {
        CreateMap<ShipEquipment, Guid>()
            .ConstructUsing(src => src.Id);
    }
}