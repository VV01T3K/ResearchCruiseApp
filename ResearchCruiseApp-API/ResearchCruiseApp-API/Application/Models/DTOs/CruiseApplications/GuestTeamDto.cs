using AutoMapper;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class GuestTeamDto
{
    public string Name { get; init; } = null!;
    
    public string NoOfPersons { get; init; } = null!;


    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<GuestTeamDto, GuestUnit>()
                .ForMember(
                    dest => dest.Id,
                    options =>
                        options.Ignore())
                .ForMember(
                    dest => dest.FormAGuestUnits,
                    options =>
                        options.Ignore());

            CreateMap<FormAGuestUnit, GuestTeamDto>()
                .ForMember(
                    dest => dest.Name,
                    options =>
                        options.MapFrom(src => src.GuestUnit.Name));
            
            CreateMap<FormBGuestUnit, GuestTeamDto>()
                .ForMember(
                    dest => dest.Name,
                    options =>
                        options.MapFrom(src => src.GuestUnit.Name));
        }
    }
}