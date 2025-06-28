using AutoMapper;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Models.Mapping.CruiseApplications;

internal class ContractMapProfile : Profile
{
    public ContractMapProfile()
    {
        CreateMap<Contract, ContractDto>()
            .ForMember(dest => dest.Scans, options => options.Ignore());

        CreateMap<ContractDto, Contract>()
            .ForMember(dest => dest.Files, options => options.Ignore());
    }
}
