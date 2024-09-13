using AutoMapper;
using ResearchCruiseApp_API.Domain.Common.Extensions;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class CruiseApplicationDto
{
    public Guid Id { get; init; }
    
    public string Number { get; init; } = null!;
    
    public DateOnly Date { get; init; }
    
    public int Year { get; init; }
    
    public Guid CruiseManagerId { get; init; }
    
    public string CruiseManagerEmail { get; set; } = null!;
    
    public string CruiseManagerFirstName { get; set; } = null!;
    
    public string CruiseManagerLastName { get; set; } = null!;
    
    public Guid DeputyManagerId { get; init; }
    
    public string DeputyManagerEmail { get; set; } = null!;
    
    public string DeputyManagerFirstName { get; set; } = null!;
    
    public string DeputyManagerLastName { get; set; } = null!;
    
    public bool HasFormA { get; init; }
    
    public bool HasFormB{ get; init; }
    
    public bool HasFormC { get; init; }
    
    public int Points { get; set; }
    
    public string Status { get; init; } = null!;


    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<CruiseApplication, CruiseApplicationDto>()
            .ForMember(
                dest => dest.Year,
                options =>
                    options.MapFrom(src =>
                        src.FormA != null ? src.FormA.Year : default))
            .ForMember(
                dest => dest.CruiseManagerId,
                options =>
                    options.MapFrom(src =>
                        src.FormA != null ? src.FormA.CruiseManagerId : Guid.Empty))
            .ForMember(
                dest => dest.DeputyManagerId,
                options =>
                    options.MapFrom(src =>
                        src.FormA != null ? src.FormA.DeputyManagerId : Guid.Empty))
            .ForMember(
                dest => dest.HasFormA,
                options =>
                    options.MapFrom(src =>
                        src.FormA != null))
            .ForMember(
                dest => dest.HasFormB,
                options =>
                    options.MapFrom(src =>
                        src.FormB != null))
            .ForMember(
                dest => dest.HasFormC,
                options =>
                    options.MapFrom(src =>
                        src.FormC != null))
            .ForMember(
                dest => dest.Status,
                options =>
                    options.MapFrom(src => 
                        src.Status.GetStringValue()
                    ));
        }
    }
}   