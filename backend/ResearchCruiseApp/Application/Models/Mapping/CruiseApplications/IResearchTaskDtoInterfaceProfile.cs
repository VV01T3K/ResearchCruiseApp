using AutoMapper;
using ResearchCruiseApp.Application.Models.Interfaces;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Models.Mapping.CruiseApplications;


internal class ResearchTaskDtoInterfaceProfile : Profile
{
    public ResearchTaskDtoInterfaceProfile()
    {
        CreateMap<IResearchTaskDto, ResearchTask>();
    }
}