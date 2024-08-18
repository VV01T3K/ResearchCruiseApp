using AutoMapper;
using ResearchCruiseApp_API.Application.Common.Models.DTOs;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.DTOs.Cruises;


public class CruiseDto
{
    public Guid Id { get; set; }
    
    public string Number { get; set; } = null!;
    
    public StringRangeDto Date { get; set; }
    
    public Guid MainCruiseManagerId { get; set; }
    
    public string MainCruiseManagerFirstName { get; set; } = null!;
    
    public string MainCruiseManagerLastName { get; set; } = null!;
    
    public Guid MainDeputyManagerId { get; set; }
    
    public List<CruiseApplicationShortInfoDto> CruiseApplicationsShortInfo { get; set; } = null!;


    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<Cruise, CruiseDto>()
                .ForMember(
                    dest => dest.Date,
                    options =>
                        options.MapFrom(src =>
                            new StringRangeDto
                            {
                                Start = src.StartDate.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffK"),
                                End = src.EndDate.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffK")
                            }))
                .ForMember(
                    dest => dest.CruiseApplicationsShortInfo,
                    options=>
                        options.MapFrom(src => 
                            src.CruiseApplications));
        }
    }
}   