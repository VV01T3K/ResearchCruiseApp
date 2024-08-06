using AutoMapper;
using ResearchCruiseApp_API.Application.Common.Models.DTOs;
using ResearchCruiseApp_API.Domain.Entities;
using ResearchCruiseApp_API.Infrastructure.Services.Identity;
using User = ResearchCruiseApp_API.Domain.Entities.User;

namespace ResearchCruiseApp_API.Application.Models.DTOs.Cruises;


public class CruiseFormDto
{
    public StringRangeDto Date { get; set; }

    public CruiseManagersTeamDto ManagersTeam { get; set; }
    public List<Guid> ApplicationsIds { get; set; } = [];
    
    
    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<CruiseFormDto, Cruise>()
                .ForMember(
                    dest => dest.MainCruiseManager,
                    options =>
                        options.MapFrom(src =>
                            (User?)null))
                .ForMember(
                    dest => dest.MainDeputyManager,
                    options =>
                        options.MapFrom(src =>
                            (User?)null))
                .ForMember(
                    dest => dest.Number,
                    options =>
                        options.MapFrom(src =>
                            string.Empty))
                .ForMember(
                    dest => dest.StartDate,
                    options =>
                        options.MapFrom(src =>
                            src.Date.Start))
                .ForMember(
                    dest => dest.EndDate,
                    options =>
                        options.MapFrom(src =>
                            src.Date.End));
        }
    }
}