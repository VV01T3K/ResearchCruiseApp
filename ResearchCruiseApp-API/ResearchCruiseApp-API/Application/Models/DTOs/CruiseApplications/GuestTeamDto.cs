using AutoMapper;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class GuestTeamDto
{
    public string Institution { get; set; } = null!;
    public string NoOfPersons { get; set; } = null!;


    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<GuestTeam, GuestTeamDto>()
                .ReverseMap();
        }
    }
}