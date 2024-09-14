using System.ComponentModel.DataAnnotations;
using AutoMapper;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class UgUnitDto
{
    public Guid Id { get; init; }

    public string Name { get; set; } = null!;


    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<UgUnit, UgUnitDto>();
        }
    }
}