using AutoMapper;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class ContractDto
{
    public string Category { get; set; } = null!;

    public string InstitutionName { get; set; } = null!;
    
    public string InstitutionUnit { get; set; } = null!;
    
    public string InstitutionLocalization { get; set; } = null!;

    public string Description { get; set; } = null!;

    public FileDto Scan { get; set; } = null!;


    private class MapProfile : Profile
    {
        public MapProfile()
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
}