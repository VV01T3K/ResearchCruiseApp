using AutoMapper;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.UseCaseServices.CruiseApplications.DTOs;


public class InstitutionDto
{
    public string Name { get; set; } = null!;
    public string Unit { get; set; } = null!;
    public string Localization { get; set; } = null!;


    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<Contract, InstitutionDto>()
                .ForMember(
                    dest => dest.Name,
                    options =>
                        options.MapFrom(src =>
                            src.InstitutionName))
                .ForMember(
                    dest => dest.Unit,
                    options =>
                        options.MapFrom(src =>
                            src.InstitutionUnit))
                .ForMember(
                    dest => dest.Localization,
                    options =>
                        options.MapFrom(src =>
                            src.InstitutionLocalization));
        }
    }
}