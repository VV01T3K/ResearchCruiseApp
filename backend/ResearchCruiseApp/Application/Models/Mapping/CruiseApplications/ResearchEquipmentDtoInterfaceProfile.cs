using AutoMapper;
using ResearchCruiseApp.Application.Models.Interfaces;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Models.Mapping.CruiseApplications;

internal class ResearchEquipmentDtoInterfaceProfile : Profile
{
    public ResearchEquipmentDtoInterfaceProfile()
    {
        CreateMap<IResearchEquipmentDto, ResearchEquipment>();
    }
}
