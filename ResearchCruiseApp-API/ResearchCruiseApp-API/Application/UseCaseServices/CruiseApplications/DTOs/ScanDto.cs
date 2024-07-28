using AutoMapper;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.UseCaseServices.CruiseApplications.DTOs;


public class ScanDto
{
    public string Name { get; set; } = null!;
    public string Content { get; set; } = null!;


    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<Contract, ScanDto>()
                .ForMember(
                    dest => dest.Name,
                    options =>
                        options.MapFrom(src =>
                            src.ScanName));
        }
    }
}