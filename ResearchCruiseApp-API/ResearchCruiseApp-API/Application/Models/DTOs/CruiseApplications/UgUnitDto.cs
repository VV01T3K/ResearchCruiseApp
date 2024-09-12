using AutoMapper;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class UgUnitDto
{
    public Guid UgUnitId { get; init; }
    
    public int NoOfEmployees { get; init; }
    
    public int NoOfStudents { get; init; }


    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<FormAUgUnit, UgUnitDto>()
                .ForMember(
                    dest => dest.UgUnitId,
                    options =>
                        options.MapFrom(src => src.UgUnit.Id));
        }
    }
}