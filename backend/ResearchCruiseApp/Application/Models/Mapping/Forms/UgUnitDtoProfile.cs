using AutoMapper;
using ResearchCruiseApp.Application.Models.DTOs.Forms;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Models.Mapping.Forms;

internal class UgUnitDtoProfile : Profile
{
    public UgUnitDtoProfile()
    {
        CreateMap<UgUnit, UgUnitDto>();
    }
}
