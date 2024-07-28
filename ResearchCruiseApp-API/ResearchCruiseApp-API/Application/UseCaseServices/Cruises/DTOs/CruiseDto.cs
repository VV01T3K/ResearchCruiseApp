using AutoMapper;
using ResearchCruiseApp_API.Application.Common.DTOs;
using ResearchCruiseApp_API.Application.UseCaseServices.Cruises.DTOs.Properties;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.UseCaseServices.Cruises.DTOs;


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
                    dest => dest.MainCruiseManagerId,
                    options =>
                        options.MapFrom(src =>
                            src.MainCruiseManager != null ? Guid.Parse(src.MainCruiseManager.Id) : Guid.Empty))
                .ForMember(
                    dest => dest.MainCruiseManagerFirstName,
                    options =>
                        options.MapFrom(src =>
                            src.MainCruiseManager != null ? src.MainCruiseManager.FirstName : string.Empty))
                .ForMember(
                    dest => dest.MainCruiseManagerLastName,
                    options =>
                        options.MapFrom(src =>
                            src.MainCruiseManager != null ? src.MainCruiseManager.LastName : string.Empty))
                .ForMember(
                    dest => dest.MainDeputyManagerId,
                    options =>
                        options.MapFrom(src =>
                            src.MainDeputyManager != null ? Guid.Parse(src.MainDeputyManager.Id) : Guid.Empty))
                .ForMember(
                    dest => dest.Date,
                    options =>
                        options.MapFrom(src =>
                            new StringRangeDto
                            {
                                Start = src.StartDate.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffK"),
                                End = src.EndDate.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffK")
                            }));
        }
    }
}   