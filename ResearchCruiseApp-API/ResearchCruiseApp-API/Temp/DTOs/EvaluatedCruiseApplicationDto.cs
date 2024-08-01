using AutoMapper;
using ResearchCruiseApp_API.Application.UseCases.CruiseApplications.DTOs;
using ResearchCruiseApp_API.Temp.Entities;

namespace ResearchCruiseApp_API.Temp.DTOs;


public class EvaluatedCruiseApplicationDto
{
    public List<EvaluatedResearchTaskDto> ResearchTasks { get; set; } = [];
    
    public List<EvaluatedContractDto> Contracts { get; set; }  = [];
    
    public List<UgTeamDto> UgTeams { get; set; } = [];
    public int UgTeamsPoints { get; set; }

    public List<GuestTeamDto> GuestTeams { get; set; } = [];

    public List<EvaluatedPublicationDto> Publications { get; set; } = [];

    public List<EvaluatedResearchTaskDto> CruiseEffects { get; set; } = [];

    public List<EvaluatedSpubTaskDto> SpubTasks { get; set; } = [];


    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<EvaluatedCruiseApplicationDto, EvaluatedCruiseApplication>()
                .ReverseMap();
        }
    }
}