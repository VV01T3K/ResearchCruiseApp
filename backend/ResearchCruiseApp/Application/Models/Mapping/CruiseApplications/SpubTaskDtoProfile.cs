using AutoMapper;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Models.Mapping.CruiseApplications;


internal class SpubTaskDtoProfile : Profile
{
    public SpubTaskDtoProfile()
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