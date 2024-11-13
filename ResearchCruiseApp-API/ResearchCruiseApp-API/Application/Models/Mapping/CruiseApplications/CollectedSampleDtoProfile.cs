using AutoMapper;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.Mapping.CruiseApplications;


internal class CollectedSampleDtoProfile : Profile
{
    public CollectedSampleDtoProfile()
    {
        CreateMap<CollectedSampleDto, CollectedSample>();
            
        CreateMap<CollectedSample, CollectedSampleDto>();
    }
}