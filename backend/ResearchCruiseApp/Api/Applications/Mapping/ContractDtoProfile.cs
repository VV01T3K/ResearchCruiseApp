using AutoMapper;
using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Mapping;

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
