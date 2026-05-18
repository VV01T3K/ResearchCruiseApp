using AutoMapper;
using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Mapping;

internal class FormASpubTaskDtoProfile : Profile
{
    public FormASpubTaskDtoProfile()
    {
        CreateMap<FormASpubTask, FormASpubTaskDto>();
    }
}
