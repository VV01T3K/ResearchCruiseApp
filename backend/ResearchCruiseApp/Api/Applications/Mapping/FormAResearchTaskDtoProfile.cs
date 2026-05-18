using AutoMapper;
using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Mapping;

internal class FormAResearchTaskDtoProfile : Profile
{
    public FormAResearchTaskDtoProfile()
    {
        CreateMap<FormAResearchTask, FormAResearchTaskDto>();
    }
}
