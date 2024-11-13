using AutoMapper;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.Mapping.CruiseApplications;


internal class ContractMapProfile : Profile
{
    public ContractMapProfile()
    {
        CreateMap<Contract, ContractDto>()
            .ForMember(
                dest => dest.Scan,
                options =>
                    options.Ignore());

        CreateMap<ContractDto, Contract>()
            .ForMember(
                dest => dest.ScanContent,
                options =>
                    options.Ignore())
            .ForMember(
                dest => dest.ScanName,
                options =>
                    options.Ignore());
    }
}