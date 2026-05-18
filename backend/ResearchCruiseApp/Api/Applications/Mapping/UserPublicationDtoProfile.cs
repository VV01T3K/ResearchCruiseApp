using AutoMapper;
using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Mapping;

internal class UserPublicationDtoProfile : Profile
{
    public UserPublicationDtoProfile()
    {
        CreateMap<UserPublication, UserPublicationDto>();
    }
}
