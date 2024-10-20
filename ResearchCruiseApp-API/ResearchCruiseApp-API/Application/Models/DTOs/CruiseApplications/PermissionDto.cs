using System.ComponentModel.DataAnnotations;
using AutoMapper;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class PermissionDto
{
    [StringLength(1024)]
    public string Description { get; set; } = null!;

    [StringLength(1024)]
    public string Executive { get; set; } = null!;

    public FileDto? Scan { get; set; }


    private class MapProfile : Profile
    {
        public MapProfile()
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
}