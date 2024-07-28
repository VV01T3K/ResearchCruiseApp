using AutoMapper;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.UseCaseServices.CruiseApplications.DTOs;


public class GuestTeamDto
{
    public string Institution { get; set; } = null!;
    public int NoOfPersons { get; set; }


    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<GuestTeam, GuestTeamDto>()
                .ReverseMap();
        }
    }
}