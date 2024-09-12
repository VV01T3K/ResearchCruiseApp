using AutoMapper;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class GuestUnitDto
{
    public string Name { get; init; } = null!;
    public int NoOfPersons { get; init; }


    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<GuestUnitDto, GuestUnit>()
                .ForMember(
                    dest => dest.Id,
                    options =>
                        options.Ignore())
                .ForMember(
                    dest => dest.FormAGuestUnits,
                    options =>
                        options.Ignore());

            CreateMap<FormAGuestUnit, GuestUnitDto>()
                .ForMember(
                    dest => dest.Name,
                    options =>
                        options.MapFrom(src => src.GuestUnit.Name));
        }
    }
}