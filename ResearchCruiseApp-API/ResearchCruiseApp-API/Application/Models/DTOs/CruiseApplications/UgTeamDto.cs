using AutoMapper;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class UgTeamDto
{
    public int Unit { get; set; }
    public int NoOfEmployees { get; set; }
    public int NoOfStudents { get; set; }


    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<UgTeam, UgTeamDto>()
                .ReverseMap();
        }
    }
}