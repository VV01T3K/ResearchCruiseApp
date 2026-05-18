using AutoMapper;
using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Mapping;

internal class SpubTaskDtoProfile : Profile
{
    public SpubTaskDtoProfile()
    {
        CreateMap<SpubTaskDto, SpubTask>()
            .ForMember(dest => dest.Id, options => options.Ignore())
            .ForMember(dest => dest.FormASpubTasks, options => options.Ignore());

        CreateMap<SpubTask, SpubTaskDto>();

        CreateMap<FormASpubTask, SpubTaskDto>()
            .ForMember(
                dest => dest.YearFrom,
                options => options.MapFrom(src => src.SpubTask.YearFrom)
            )
            .ForMember(dest => dest.YearTo, options => options.MapFrom(src => src.SpubTask.YearTo))
            .ForMember(dest => dest.Name, options => options.MapFrom(src => src.SpubTask.Name));
    }
}
