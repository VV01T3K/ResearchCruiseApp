using AutoMapper;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class UgTeamDto
{
    public Guid UnitId { get; set; }
    public string NoOfEmployees { get; set; } = null!;
    public string NoOfStudents { get; set; } = null!;


    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<UgTeam, UgTeamDto>()
                .ReverseMap();
        }
    }
}