using AutoMapper;
using Microsoft.Extensions.Options;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class ContractDto
{
    public string Category { get; set; } = null!;

    public InstitutionDto Institution { get; set; } = null!;

    public string Description { get; set; } = null!;

    public ScanDto Scan { get; set; } = null!;


    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<Contract, ContractDto>()
                .ForMember(
                    dest => dest.Institution,
                    options =>
                        options.MapFrom(src => src))
                .ForMember(
                    dest => dest.Scan,
                    options =>
                        options.Ignore());

            CreateMap<ContractDto, Contract>()
                .ForMember(
                    dest => dest.InstitutionName,
                    options =>
                        options.MapFrom(src =>
                            src.Institution.Name))
                .ForMember(
                    dest => dest.InstitutionUnit,
                    options =>
                        options.MapFrom(src =>
                            src.Institution.Unit))
                .ForMember(
                    dest => dest.InstitutionLocalization,
                    options =>
                        options.MapFrom(src =>
                            src.Institution.Localization))
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