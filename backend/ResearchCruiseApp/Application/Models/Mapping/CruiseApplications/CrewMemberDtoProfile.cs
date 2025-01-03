using AutoMapper;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Models.Mapping.CruiseApplications;

internal class CrewMemberDtoProfile : Profile
{
    public CrewMemberDtoProfile()
    {
        CreateMap<CrewMemberDto, CrewMember>();

        CreateMap<CrewMember, CrewMemberDto>();
    }
}
