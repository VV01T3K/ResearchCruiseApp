using System.ComponentModel.DataAnnotations;
using AutoMapper;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class UgTeamWithNameDto
{
    [StringLength(1024)] public string UgUnitName { get; init; } = null!;

    [StringLength(1024)] public string NoOfEmployees { get; init; } = null!;

    [StringLength(1024)] public string NoOfStudents { get; init; } = null!;


    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<FormAUgUnit, UgTeamWithNameDto>()
                .ForMember(
                    dest => dest.UgUnitName,
                    options =>
                        options.MapFrom(src => src.UgUnit.Name));
        }
    }
}