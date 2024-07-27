using AutoMapper;
using ResearchCruiseApp_API.Application.DTOs.DataTypes;
using ResearchCruiseApp_API.Application.DTOs.DataTypes.DataSubTypes;
using ResearchCruiseApp_API.Domain.Entities;
using ResearchCruiseApp_API.Infrastructure.Persistence.DbContexts;
using ResearchCruiseApp_API.Infrastructure.Tools;
using Contract = ResearchCruiseApp_API.Domain.Entities.Contract;
using GuestTeam = ResearchCruiseApp_API.Domain.Entities.GuestTeam;
using Publication = ResearchCruiseApp_API.Domain.Entities.Publication;
using ResearchTask = ResearchCruiseApp_API.Domain.Entities.ResearchTask;
using SpubTask = ResearchCruiseApp_API.Application.DTOs.DataTypes.SpubTask;
using Thesis = ResearchCruiseApp_API.Domain.Entities.Thesis;
using UgTeam = ResearchCruiseApp_API.Application.DTOs.DataTypes.UgTeam;

namespace ResearchCruiseApp_API.Application.DTOs.MapProfiles;

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
        
        CreateMap<ResearchTask, DataTypes.ResearchTask>()
            .ForMember(
                dest => dest.Values,
                options =>
                    options.MapFrom(src =>
                        src));

        CreateMap<ResearchTask, ResearchTaskValues>()
            .ForMember(
                dest => dest.Time,
                options =>
                    options.MapFrom(src =>
                        src.StartDate != null && src.EndDate != null ?
                            new StringRange{ Start = src.StartDate, End = src.EndDate } :
                            (StringRange?)null));
        
        CreateMap<Contract, DataTypes.Contract>()
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

        CreateMap<Domain.Entities.UgTeam, UgTeam>();
        
        CreateMap<GuestTeam, DataTypes.GuestTeam>();
        
        CreateMap<Publication, DataTypes.Publication>();
        
        CreateMap<Thesis, DataTypes.Thesis>();

        CreateMap<Domain.Entities.SpubTask, SpubTask>();
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