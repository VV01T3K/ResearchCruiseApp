using AutoMapper;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Models.Mapping.CruiseApplications;


internal class UserPublicationDtoProfile : Profile
{
    public UserPublicationDtoProfile()
    {
        CreateMap<UserPublication, UserPublicationDto>();
    }
}