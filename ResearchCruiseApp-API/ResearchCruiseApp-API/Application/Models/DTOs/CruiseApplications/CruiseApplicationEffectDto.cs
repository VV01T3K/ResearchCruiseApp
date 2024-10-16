using AutoMapper;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


/// <summary>
/// Represents the associative entity between CruiseApplication and ResearchTaskEffect
/// </summary>
public class CruiseApplicationEffectDto
{
    public Guid Id { get; set; }

    public ResearchTaskEffectDto Effect { get; set; } = null!;

    public string Points { get; set; } = "0";


    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<CruiseApplicationEffect, CruiseApplicationEffectDto>();
        }
    }
}