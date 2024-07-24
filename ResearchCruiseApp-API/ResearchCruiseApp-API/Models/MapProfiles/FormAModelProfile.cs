using AutoMapper;
using ResearchCruiseApp_API.Data;
using ResearchCruiseApp_API.Tools;

namespace ResearchCruiseApp_API.Models.MapProfiles;

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

        CreateMap<Models.DataTypes.ResearchTask, Data.ResearchTask>()
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

        CreateMap<Models.DataTypes.Contract, Data.Contract>()
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

        CreateMap<Models.DataTypes.UGTeam, Data.UGTeam>();

        CreateMap<Models.DataTypes.GuestTeam, Data.GuestTeam>();

        CreateMap<Models.DataTypes.Publication, Data.Publication>();

        CreateMap<Models.DataTypes.Thesis, Data.Thesis>();

        CreateMap<Models.DataTypes.SPUBTask, Data.SPUBTask>();
    }
    
    private class ScanContentResolver(
        ResearchCruiseContext researchCruiseContext, ICompressor compressor)
        : IValueResolver<Models.DataTypes.Contract, Contract, byte[]>
    {
        public byte[] Resolve(
            Models.DataTypes.Contract src, Contract dest, byte[] scanContent, ResolutionContext context)
        {
            var result = compressor.Compress(src.Scan.Content).Result;
            return result;
        }
    }
}