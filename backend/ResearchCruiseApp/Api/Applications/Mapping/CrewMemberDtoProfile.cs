using AutoMapper;
using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Mapping;

internal class CrewMemberDtoProfile : Profile
{
    public CrewMemberDtoProfile()
    {
        CreateMap<CrewMemberDto, CrewMember>();

        CreateMap<CrewMember, CrewMemberDto>();
    }
}
