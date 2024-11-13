using AutoMapper;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.Mapping.CruiseApplications;


internal class FormASpubTaskDtoProfile : Profile
{
    public FormASpubTaskDtoProfile()
    {
        CreateMap<FormASpubTask, FormASpubTaskDto>();
    }
}