using AutoMapper;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Models.Mapping.CruiseApplications;

internal class PortDtoProfile : Profile
{
    public PortDtoProfile()
    {
        CreateMap<PortDto, Port>()
            .ForAllMembers(options =>
            {
                if (options.DestinationMember.Name != nameof(Port.Name))
                    options.Ignore();
            });

        CreateMap<FormBPort, PortDto>()
            .ForMember(dest => dest.Name, options => options.MapFrom(src => src.Port.Name));

        CreateMap<FormCPort, PortDto>()
            .ForMember(dest => dest.Name, options => options.MapFrom(src => src.Port.Name));
    }
}
