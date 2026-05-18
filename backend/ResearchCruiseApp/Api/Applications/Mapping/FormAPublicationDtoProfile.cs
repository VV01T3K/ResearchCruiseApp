using AutoMapper;
using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Mapping;

internal class FormAPublicationDtoProfile : Profile
{
    public FormAPublicationDtoProfile()
    {
        CreateMap<FormAPublication, FormAPublicationDto>();
    }
}
