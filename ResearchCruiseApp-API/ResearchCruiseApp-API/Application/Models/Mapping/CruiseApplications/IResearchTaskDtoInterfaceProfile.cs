using AutoMapper;
using ResearchCruiseApp_API.Application.Models.Interfaces;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.Mapping.CruiseApplications;


internal class ResearchTaskDtoInterfaceProfile : Profile
{
    public ResearchTaskDtoInterfaceProfile()
    {
        CreateMap<IResearchTaskDto, ResearchTask>();
    }
}