using AutoMapper;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Models.Mapping.CruiseApplications;


internal class CollectedSampleDtoProfile : Profile
{
    public CollectedSampleDtoProfile()
    {
        CreateMap<CollectedSampleDto, CollectedSample>();
            
        CreateMap<CollectedSample, CollectedSampleDto>();
    }
}