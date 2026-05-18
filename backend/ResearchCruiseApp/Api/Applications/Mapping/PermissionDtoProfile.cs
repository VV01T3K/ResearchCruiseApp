using AutoMapper;
using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Mapping;

internal class PermissionDtoProfile : Profile
{
    public PermissionDtoProfile()
    {
        CreateMap<PermissionDto, Permission>()
            .ForMember(dest => dest.ScanContent, options => options.Ignore()) // Member requires complex logic
            .ForMember(dest => dest.ScanName, options => options.Ignore()); // Member requires complex logic

        CreateMap<Permission, PermissionDto>()
            .ForMember(dest => dest.Scan, options => options.Ignore()); // Member requires complex logic
    }
}
