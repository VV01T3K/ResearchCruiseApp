using AutoMapper;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.Interfaces;


public interface IResearchEquipmentDto
{
    string Name { get; init; }

    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<IResearchEquipmentDto, ResearchEquipment>();
        }
    }
}