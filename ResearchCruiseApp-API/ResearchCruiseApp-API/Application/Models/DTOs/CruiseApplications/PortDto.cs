using System.ComponentModel.DataAnnotations;
using AutoMapper;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class PortDto
{
    [StringLength(1024)]
    public string Name { get; init; } = null!;
    
    [StringLength(1024)]
    public string StartTime { get; init; } = null!;

    [StringLength(1024)]
    public string EndTime { get; init; } = null!;
    
    
    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<PortDto, Port>()
                .ForAllMembers(options =>
                {
                    if (options.DestinationMember.Name != nameof(Port.Name))
                        options.Ignore();
                });

            CreateMap<FormBPort, PortDto>()
                .ForMember(
                    dest => dest.Name,
                    options =>
                        options.MapFrom(src => src.Port.Name));
        }
    }
}