using AutoMapper;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.DTOs.Cruises;


public class CruiseFormDto
{
    public string StartDate { get; set; } = null!;

    public string EndDate { get; set; } = null!;

    public CruiseManagersTeamDto ManagersTeam { get; set; }
    
    public List<Guid> CruiseApplicationsIds { get; set; } = [];
    
    
    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<CruiseFormDto, Cruise>()
                .ForMember(
                    dest => dest.MainCruiseManagerId,
                    options =>
                        options.MapFrom(src =>
                            src.ManagersTeam.MainCruiseManagerId))
                .ForMember(
                    dest => dest.MainDeputyManagerId,
                    options =>
                        options.MapFrom(src =>
                            src.ManagersTeam.MainDeputyManagerId))
                .ForMember(
                    dest => dest.Number,
                    options =>
                        options.MapFrom(src => string.Empty));
        }
    }
}