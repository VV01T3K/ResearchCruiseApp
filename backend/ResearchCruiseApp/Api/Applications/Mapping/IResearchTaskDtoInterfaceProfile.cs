using AutoMapper;
using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Mapping;

internal class ResearchTaskDtoInterfaceProfile : Profile
{
    public ResearchTaskDtoInterfaceProfile()
    {
        CreateMap<IResearchTaskDto, ResearchTask>();
    }
}
