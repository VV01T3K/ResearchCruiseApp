using AutoMapper;
using ResearchCruiseApp_API.Domain.Common.Extensions;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.DTOs;


public class CruiseApplicationDto
{
    public Guid Id { get; set; }
    public string Number { get; set; } = null!;
    public DateOnly Date { get; set; }
    public int Year { get; set; }
    public Guid CruiseManagerId { get; set; }
    public string? CruiseManagerEmail { get; set; }
    public string CruiseManagerFirstName { get; set; } = null!;
    public string CruiseManagerLastName { get; set; } = null!;
    public Guid DeputyManagerId { get; set; }
    public string? DeputyManagerEmail { get; set; }
    public string DeputyManagerFirstName { get; set; } = null!;
    public string DeputyManagerLastName { get; set; } = null!;
    public bool HasFormA { get; set; }
    public bool HasFormB{ get; set; }
    public bool HasFormC { get; set; }
    public int Points { get; set; }
    public string Status { get; set; } = null!;
    public string? PointsDetails { get; set; }


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
                        src.FormA != null ? Guid.Parse(src.FormA.CruiseManager.Id) : Guid.Empty))
            .ForMember(
                dest => dest.CruiseManagerEmail,
                options =>
                    options.MapFrom(src =>
                        src.FormA != null ? src.FormA.CruiseManager.Email : string.Empty))
            .ForMember(
                dest => dest.CruiseManagerFirstName,
                options =>
                    options.MapFrom(src =>
                        src.FormA != null ? src.FormA.CruiseManager.FirstName : string.Empty))
            .ForMember(
                dest => dest.CruiseManagerLastName,
                options =>
                    options.MapFrom(src =>
                        src.FormA != null ? src.FormA.CruiseManager.LastName : string.Empty))
            .ForMember(
                dest => dest.DeputyManagerId,
                options =>
                    options.MapFrom(src =>
                        src.FormA != null ? Guid.Parse(src.FormA.DeputyManager.Id) : Guid.Empty))
            .ForMember(
                dest => dest.DeputyManagerEmail,
                options =>
                    options.MapFrom(src =>
                        src.FormA != null ? src.FormA.DeputyManager.Email : string.Empty))
            .ForMember(
                dest => dest.DeputyManagerFirstName,
                options =>
                    options.MapFrom(src =>
                        src.FormA != null ? src.FormA.DeputyManager.FirstName : string.Empty))
            .ForMember(
                dest => dest.DeputyManagerLastName,
                options =>
                    options.MapFrom(src =>
                        src.FormA != null ? src.FormA.DeputyManager.LastName : string.Empty))
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