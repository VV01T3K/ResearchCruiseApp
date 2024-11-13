using AutoMapper;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.Mapping.CruiseApplications;


internal class PermissionDtoProfile : Profile
{
    public PermissionDtoProfile()
    {
        CreateMap<PermissionDto, Permission>()
            .ForMember(
                dest => dest.ScanContent,
                options =>
                    options.Ignore()) // Member requires complex logic
            .ForMember(
                dest => dest.ScanName,
                options =>
                    options.Ignore()); // Member requires complex logic

        CreateMap<Permission, PermissionDto>()
            .ForMember(
                dest => dest.Scan,
                options =>
                    options.Ignore()); // Member requires complex logic
    }
}