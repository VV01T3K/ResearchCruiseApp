using AutoMapper;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Common;

internal class GuidMapProfile : Profile
{
    public GuidMapProfile()
    {
        CreateMap<ShipEquipment, Guid>().ConstructUsing(src => src.Id);
    }
}
