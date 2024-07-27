using AutoMapper;
using ResearchCruiseApp_API.Domain.Entities;
using ResearchCruiseApp_API.Infrastructure.Persistence.DbContexts;
using ResearchCruiseApp_API.Infrastructure.Tools;

namespace ResearchCruiseApp_API.Application.DTOs.MapProfiles;

public class FormAModelProfile : Profile
{
    public FormAModelProfile()
    {
        CreateMap<FormAModel, FormA>()
            .ForMember(
                dest => dest.AcceptablePeriodBeg,
                options =>
                    options.MapFrom(src =>
                        src.AcceptablePeriod.Min()))
            .ForMember(
                dest => dest.AcceptablePeriodEnd,
                options =>
                    options.MapFrom(src =>
                        src.AcceptablePeriod.Max()))
            .ForMember(
                dest => dest.OptimalPeriodBeg,
                options =>
                    options.MapFrom(src =>
                        src.OptimalPeriod.Min()))
            .ForMember(
                dest => dest.OptimalPeriodEnd,
                options =>
                    options.MapFrom(src =>
                        src.OptimalPeriod.Max()));

        CreateMap<Application.DTOs.DataTypes.ResearchTask, ResearchTask>()
            .ForMember(
                dest => dest.Title,
                options =>
                    options.MapFrom(src =>
                        src.Values.Title))
            .ForMember(
                dest => dest.Author,
                options =>
                    options.MapFrom(src =>
                        src.Values.Author))
            .ForMember(
                dest => dest.Institution,
                options =>
                    options.MapFrom(src =>
                        src.Values.Institution))
            .ForMember(
                dest => dest.Date,
                options =>
                    options.MapFrom(src =>
                        src.Values.Date))
            .ForMember(
                dest => dest.StartDate,
                options =>
                    options.MapFrom(src =>
                        src.Values.Time.HasValue ? src.Values.Time.Value.Start : null))
            .ForMember(
                dest => dest.EndDate,
                options =>
                    options.MapFrom(src =>
                        src.Values.Time.HasValue ? src.Values.Time.Value.End : null))
            .ForMember(
                dest => dest.EndDate,
                options =>
                    options.MapFrom(src =>
                        src.Values.Time.HasValue ? src.Values.Time.Value.End : null))
            .ForMember(
                dest => dest.FinancingAmount,
                options =>
                    options.MapFrom(src =>
                        src.Values.FinancingAmount))
            .ForMember(
                dest => dest.Description,
                options =>
                    options.MapFrom(src =>
                        src.Values.Description));

        CreateMap<Application.DTOs.DataTypes.Contract, Contract>()
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
                dest => dest.ScanName,
                options =>
                    options.MapFrom(src =>
                        src.Scan.Name))
            .ForMember(
                dest => dest.ScanContentCompressed,
                options =>
                    options.MapFrom<ScanContentResolver>());

        CreateMap<UgTeam, Domain.Entities.UgTeam>();

        CreateMap<GuestTeam, GuestTeam>();

        CreateMap<Publication, Publication>();

        CreateMap<Thesis, Thesis>();

        CreateMap<SpubTask, Domain.Entities.SpubTask>();
    }
    
    private class ScanContentResolver(
        ResearchCruiseContext researchCruiseContext, ICompressor compressor)
        : IValueResolver<Application.DTOs.DataTypes.Contract, Contract, byte[]>
    {
        public byte[] Resolve(
            Application.DTOs.DataTypes.Contract src, Contract dest, byte[] scanContent, ResolutionContext context)
        {
            var result = compressor.Compress(src.Scan.Content).Result;
            return result;
        }
    }
}