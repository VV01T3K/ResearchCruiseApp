using AutoMapper;
using ResearchCruiseApp_API.Application.Models.DTOs.Forms;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.Mapping.Forms;


internal class UgUnitDtoProfile : Profile
{
    public UgUnitDtoProfile()
    {
        CreateMap<UgUnit, UgUnitDto>();
    }
}