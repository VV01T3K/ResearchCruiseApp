using AutoMapper;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Models.Mapping.CruiseApplications;

internal class ContractMapProfile : Profile
{
    public ContractMapProfile()
    {
        CreateMap<Contract, ContractDto>()
            .ForMember(dest => dest.Scan, options => options.Ignore());

        CreateMap<ContractDto, Contract>()
            .ForMember(dest => dest.ScanContent, options => options.Ignore())
            .ForMember(dest => dest.ScanName, options => options.Ignore());
    }
}
