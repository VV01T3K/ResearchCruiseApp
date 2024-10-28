using AutoMapper;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class SpubTaskDto
{
    public string Name { get; init; } = null!;
    
    public string YearFrom { get; init; } = null!;
    
    public string YearTo { get; init; } = null!;
    
    
    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<SpubTaskDto, SpubTask>()
                .ForMember(
                    dest => dest.Id,
                    options => options.Ignore())
                .ForMember(dest => dest.FormASpubTasks,
                    options => options.Ignore());

            CreateMap<SpubTask, SpubTaskDto>();
            
            CreateMap<FormASpubTask, SpubTaskDto>()
                .ForMember(
                    dest => dest.YearFrom,
                    options =>
                        options.MapFrom(src => src.SpubTask.YearFrom))
                .ForMember(
                    dest => dest.YearTo,
                    options =>
                        options.MapFrom(src => src.SpubTask.YearTo))
                .ForMember(
                    dest => dest.Name,
                    options =>
                        options.MapFrom(src => src.SpubTask.Name));
        }
    }
}