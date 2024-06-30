using AutoMapper;
using ResearchCruiseApp_API.Data;
using ResearchCruiseApp_API.Models;
using Contract = ResearchCruiseApp_API.Data.Contract;
using EvaluatedSPUBTask = ResearchCruiseApp_API.Models.EvaluatedSPUBTask;
using EvaluatedPublication = ResearchCruiseApp_API.Models.EvaluatedPublication;
using EvaluatedContract = ResearchCruiseApp_API.Models.EvaluatedContract;
using EvaluatedResearchTask = ResearchCruiseApp_API.Models.EvaluatedResearchTask;

using GuestTeam = ResearchCruiseApp_API.Models.GuestTeam;
using Publication = ResearchCruiseApp_API.Models.Publication;
using ResearchTask = ResearchCruiseApp_API.Models.ResearchTask;
using SPUBTask = ResearchCruiseApp_API.Models.SPUBTask;
using UGTeam = ResearchCruiseApp_API.Models.UGTeam;
using Work = ResearchCruiseApp_API.Models.Work;

namespace ResearchCruiseApp_API.Tools
{
    public class MapperConfig
    {
        public static Mapper InitializeAutomapper()
        {
            //Provide all the Mapping Configuration
            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<SPUBTask, Data.SPUBTask>()
                    .ReverseMap()
                    ;
                
                cfg.CreateMap<EvaluatedSPUBTask, Data.EvaluatedSPUBTask>()
                    .ReverseMap()
                    ;
                
                cfg.CreateMap<GuestTeam, Data.GuestTeam>()
                    .ReverseMap()
                    ;
                
                cfg.CreateMap<UGTeam, Data.UGTeam>()
                    .ReverseMap()
                    ;
                
                cfg.CreateMap<EvaluatedApplicationModel, EvaluatedApplication>()
                    .ReverseMap()
                    ;
                cfg.CreateMap<EvaluatedApplication, EvaluatedApplicationModel>()
                    .ReverseMap()
                    ;
                cfg.CreateMap<Publication, Data.Publication>()
                    .ForMember(dest => dest.DOI, act => act.MapFrom(src => src.Info.DOI))
                    .ForMember(dest => dest.Authors, act => act.MapFrom(src => src.Info.Authors))
                    .ForMember(dest => dest.Title, act => act.MapFrom(src => src.Info.Title))
                    .ForMember(dest => dest.Magazine, act => act.MapFrom(src => src.Info.Magazine))
                    .ReverseMap()
                    ;

                cfg.CreateMap<EvaluatedPublication, Data.EvaluatedPublication>()
                    .ForMember(dest => dest.DOI, act => act.MapFrom(src => src.Info.DOI))
                    .ForMember(dest => dest.Authors, act => act.MapFrom(src => src.Info.Authors))
                    .ForMember(dest => dest.Title, act => act.MapFrom(src => src.Info.Title))
                    .ForMember(dest => dest.Magazine, act => act.MapFrom(src => src.Info.Magazine))
                    .ReverseMap()
                    ;

                
                cfg.CreateMap<Work, Data.Work>()
                    .ForMember(dest => dest.Author, act => act.MapFrom(src => src.Info.Author))
                    .ForMember(dest => dest.Title, act => act.MapFrom(src => src.Info.Title))
                    .ForMember(dest => dest.Promoter, act => act.MapFrom(src => src.Info.Promoter))
                    .ReverseMap()
                    ;
                
                cfg.CreateMap<ResearchTask, Data.ResearchTask>()
                    .ForMember(dest => dest.Title, act => act.MapFrom(src => src.Values.Title))
                    .ForMember(dest => dest.Author, act => act.MapFrom(src => src.Values.Author))
                    .ForMember(dest => dest.Institution, act => act.MapFrom(src => src.Values.Institution))
                    .ForMember(dest => dest.Date, act => act.MapFrom(src => src.Values.Date))
                    .ForMember(dest => dest.StartDate, act => act.MapFrom(src => src.Values.Time.StartDate))
                    .ForMember(dest => dest.EndDate, act => act.MapFrom(src => src.Values.Time.EndDate))
                    .ForMember(dest => dest.FinancingAmount, act => act.MapFrom(src => src.Values.FinancingAmount))
                    .ForMember(dest => dest.Description, act => act.MapFrom(src => src.Values.Description))
                    .ReverseMap()
                    ;
                
                cfg.CreateMap<EvaluatedResearchTask, Data.EvaluatedResearchTask>()
                    .ForMember(dest => dest.Title, act => act.MapFrom(src => src.Values.Title))
                    .ForMember(dest => dest.Author, act => act.MapFrom(src => src.Values.Author))
                    .ForMember(dest => dest.Institution, act => act.MapFrom(src => src.Values.Institution))
                    .ForMember(dest => dest.Date, act => act.MapFrom(src => src.Values.Date))
                    .ForMember(dest => dest.StartDate, act => act.MapFrom(src => src.Values.Time.StartDate))
                    .ForMember(dest => dest.EndDate, act => act.MapFrom(src => src.Values.Time.EndDate))
                    .ForMember(dest => dest.FinancingAmount, act => act.MapFrom(src => src.Values.FinancingAmount))
                    .ForMember(dest => dest.Description, act => act.MapFrom(src => src.Values.Description))
                    .ReverseMap()
                    ;

                cfg.CreateMap<Models.Contract, Contract>()
                    .ForMember(dest => dest.InstitutionName, act => act.MapFrom(src => src.Institution.Name))
                    .ForMember(dest => dest.InstitutionUnit, act => act.MapFrom(src => src.Institution.Unit))
                    .ForMember(dest => dest.InstitutionLocation, act => act.MapFrom(src => src.Institution.Localization))
                    .ReverseMap()
                    ;
                
                cfg.CreateMap<EvaluatedContract, Data.EvaluatedContract>()
                    .ForMember(dest => dest.InstitutionName, act => act.MapFrom(src => src.Institution.Name))
                    .ForMember(dest => dest.InstitutionUnit, act => act.MapFrom(src => src.Institution.Unit))
                    .ForMember(dest => dest.InstitutionLocation, act => act.MapFrom(src => src.Institution.Localization))
                    .ReverseMap()
                    ;

                // cfg.CreateMap<Data.Contract, Models.Contract>()
                //     .ForMember(dest => dest.Institution.Name, act => act.MapFrom(src => src.Institution))
                //     .ForMember(dest => dest.Institution.Unit, act => act.MapFrom(src => src.Unit))
                //     .ForMember(dest => dest.Institution.Localization, act => act.MapFrom(src => src.Location))
                //     ;
                
                //Configuring FormsModel and FormA
                cfg.CreateMap<FormAModel, FormA>()
                    .ForMember(dest => dest.AcceptablePeriodBeg, act => act.MapFrom(src => src.AcceptablePeriod!.Min()))
                    .ForMember(dest => dest.AcceptablePeriodEnd, act => act.MapFrom(src => src.AcceptablePeriod!.Max()))
                    .ForMember(dest => dest.OptimalPeriodBeg, act => act.MapFrom(src => src.OptimalPeriod!.Min()))
                    .ForMember(dest => dest.OptimalPeriodEnd, act => act.MapFrom(src => src.OptimalPeriod!.Max()))
                    ;

                cfg.CreateMap<FormA, FormAModel>()
                    .ForMember(
                        dest => dest.AcceptablePeriod,
                        options =>
                            options.MapFrom(src =>
                                new HashSet<int> { src.AcceptablePeriodBeg, src.AcceptablePeriodEnd }
                            ))
                    .ForMember(
                        dest => dest.OptimalPeriod,
                        options =>
                            options.MapFrom(src =>
                                new HashSet<int> { src.OptimalPeriodBeg, src.OptimalPeriodEnd }));
            });
            
            //Create an Instance of Mapper and return that Instance
            var mapper = new Mapper(config);
            return mapper;
        }   
    }
}
    