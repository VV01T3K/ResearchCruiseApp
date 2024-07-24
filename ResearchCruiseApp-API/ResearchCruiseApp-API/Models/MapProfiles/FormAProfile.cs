using AutoMapper;
using ResearchCruiseApp_API.Data;
using ResearchCruiseApp_API.Models.DataTypes;
using ResearchCruiseApp_API.Models.DataTypes.DataSubTypes;
using ResearchCruiseApp_API.Tools;
using Contract = ResearchCruiseApp_API.Data.Contract;
using UGTeam = ResearchCruiseApp_API.Data.UGTeam;

namespace ResearchCruiseApp_API.Models.MapProfiles;

public class FormAProfile : Profile
{
    public FormAProfile()
    {
        CreateMap<FormA, FormAModel>()
            .ForMember(
                dest => dest.AcceptablePeriod,
                options =>
                    options.MapFrom(src =>
                        new HashSet<int> { src.AcceptablePeriodBeg, src.AcceptablePeriodEnd }))
            .ForMember(
                dest => dest.OptimalPeriod,
                options =>
                    options.MapFrom(src =>
                        new HashSet<int> { src.OptimalPeriodBeg, src.OptimalPeriodEnd }))
            .ForMember(
                dest => dest.CruiseDays,
                options =>
                    options.MapFrom(src =>
                        src.CruiseHours / 24.0));
        
        CreateMap<Data.ResearchTask, Models.DataTypes.ResearchTask>()
            .ForMember(
                dest => dest.Values,
                options =>
                    options.MapFrom(src =>
                        src));

        CreateMap<Data.ResearchTask, ResearchTaskValues>()
            .ForMember(
                dest => dest.Time,
                options =>
                    options.MapFrom(src =>
                        src.StartDate != null && src.EndDate != null ?
                            new StringRange{ Start = src.StartDate, End = src.EndDate } :
                            (StringRange?)null));
        
        CreateMap<Data.Contract, Models.DataTypes.Contract>()
            .ForMember(
                dest => dest.Institution,
                options =>
                    options.MapFrom(src =>
                        src))
            .ForMember(
                dest => dest.Scan,
                options =>
                    options.MapFrom(src =>
                        src));

        CreateMap<Contract, Institution>()
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

        CreateMap<Contract, Scan>()
            .ForMember(
                dest => dest.Name,
                options =>
                    options.MapFrom(src =>
                        src.ScanName))
            .ForMember(
                dest => dest.Content,
                options =>
                    options.MapFrom<ScanContentResolver>());

        CreateMap<UGTeam, Models.DataTypes.UGTeam>();
        
        CreateMap<Data.GuestTeam, Models.DataTypes.GuestTeam>();
        
        CreateMap<Data.Publication, Models.DataTypes.Publication>();
        
        CreateMap<Data.Thesis, Models.DataTypes.Thesis>();

        CreateMap<Data.SPUBTask, Models.DataTypes.SPUBTask>();
    }
    
    private class ScanContentResolver(
        ResearchCruiseContext researchCruiseContext, ICompressor compressor)
        : IValueResolver<Contract, Scan, string>
    {
        public string Resolve(
            Contract src, Scan dest, string scanContent, ResolutionContext context)
        {
            var result = compressor.Decompress(src.ScanContentCompressed).Result;
            return result;
        }
    }
}