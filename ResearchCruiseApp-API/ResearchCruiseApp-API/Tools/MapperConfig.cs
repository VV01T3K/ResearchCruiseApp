using AutoMapper;
using ResearchCruiseApp_API.Data;
using ResearchCruiseApp_API.Models;
/*
using Contract = ResearchCruiseApp_API.Data.Contract;
using EvaluatedSPUBTask = ResearchCruiseApp_API.Models.EvaluatedSPUBTask;
using EvaluatedPublication = ResearchCruiseApp_API.Models.EvaluatedPublication;
using EvaluatedContract = ResearchCruiseApp_API.Models.EvaluatedContract;
using EvaluatedResearchTask = ResearchCruiseApp_API.Models.EvaluatedResearchTask;

using GuestTeam = ResearchCruiseApp_API.Models.DataTypes.GuestTeam;
using Publication = ResearchCruiseApp_API.Models.Publication;
using ResearchTask = ResearchCruiseApp_API.Models.ResearchTask;
using SPUBTask = ResearchCruiseApp_API.Models.SPUBTask;
using UGTeam = ResearchCruiseApp_API.Models.UGTeam;
using Work = ResearchCruiseApp_API.Models.Work;
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
*/

namespace ResearchCruiseApp_API.Tools
{
    public class MapperConfig
    {
        public static Mapper InitializeAutomapper()
        {
            //Provide all the Mapping Configuration
            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Models.DataTypes.SPUBTask, Data.SPUBTask>()
                    .ReverseMap()
                    ;
                
                cfg.CreateMap<Models.DataTypes.GuestTeam, Data.GuestTeam>()
                    .ReverseMap()
                    ;
                
                cfg.CreateMap<Models.DataTypes.UGTeam, Data.UGTeam>()
                    .ReverseMap()
                    ;
                
                cfg.CreateMap<Models.DataTypes.GuestTeam, Data.GuestTeam>()
                    .ReverseMap()
                    ;
                
                cfg.CreateMap<Models.DataTypes.Publication, Data.Publication>()
                    .ReverseMap()
                    ;
                
                cfg.CreateMap<Models.DataTypes.Thesis, Data.Thesis>()
                    .ReverseMap()
                    ;
                
                cfg.CreateMap<Models.DataTypes.ResearchTask, Data.ResearchTask>()
                    .ForMember(dest => dest.Title, act => act.MapFrom(src => src.Values.Title))
                    .ForMember(dest => dest.Author, act => act.MapFrom(src => src.Values.Author))
                    .ForMember(dest => dest.Institution, act => act.MapFrom(src => src.Values.Institution))
                    .ForMember(dest => dest.Date, act => act.MapFrom(src => src.Values.Date))
                    .ForMember(dest => dest.StartDate, act => act.MapFrom(src => src.Values.Time.HasValue ? src.Values.Time.Value.Start : null))
                    .ForMember(dest => dest.EndDate, act => act.MapFrom(src => src.Values.Time.HasValue ? src.Values.Time.Value.End : null))
                    .ForMember(dest => dest.FinancingAmount, act => act.MapFrom(src => src.Values.FinancingAmount))
                    .ForMember(dest => dest.Description, act => act.MapFrom(src => src.Values.Description))
                    .ReverseMap()
                    ;
                
                cfg.CreateMap<Models.DataTypes.Contract, Data.Contract>()
                    .ForMember(dest => dest.InstitutionName, act => act.MapFrom(src => src.Institution.Name))
                    .ForMember(dest => dest.InstitutionUnit, act => act.MapFrom(src => src.Institution.Unit))
                    .ForMember(dest => dest.InstitutionLocation, act => act.MapFrom(src => src.Institution.Localization))
                    .ReverseMap()
                    ;
                
                //Configuring FormsModel and FormA
                cfg.CreateMap<FormAModel, FormA>()
                    .ForMember(dest => dest.AcceptablePeriodBeg, act => act.MapFrom(src => src.AcceptablePeriod.Min()))
                    .ForMember(dest => dest.AcceptablePeriodEnd, act => act.MapFrom(src => src.AcceptablePeriod.Max()))
                    .ForMember(dest => dest.OptimalPeriodBeg, act => act.MapFrom(src => src.OptimalPeriod.Min()))
                    .ForMember(dest => dest.OptimalPeriodEnd, act => act.MapFrom(src => src.OptimalPeriod.Max()))
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
                
                
                /*cfg.CreateMap<Models.EvaluatedResearchTask, Data.EvaluatedResearchTask>()
                    .ForPath(dest => dest.ResearchTask.Title, act => act.MapFrom(src => src.Values.Title))
                    .ForPath(dest => dest.ResearchTask.Author, act => act.MapFrom(src => src.Values.Author))
                    .ForPath(dest => dest.ResearchTask.Institution, act => act.MapFrom(src => src.Values.Institution))
                    .ForPath(dest => dest.ResearchTask.Date, act => act.MapFrom(src => src.Values.Date))
                    .ForPath(dest => dest.ResearchTask.StartDate, act => act.MapFrom(src => src.Values.Time.StartDate))
                    .ForPath(dest => dest.ResearchTask.EndDate, act => act.MapFrom(src => src.Values.Time.EndDate))
                    .ForPath(dest => dest.ResearchTask.FinancingAmount, act => act.MapFrom(src => src.Values.FinancingAmount))
                    .ForPath(dest => dest.ResearchTask.Description, act => act.MapFrom(src => src.Values.Description))
                    .ReverseMap()
                    ;*/
                
                cfg.CreateMap<EvaluatedApplicationModel, EvaluatedApplication>()
                    .ReverseMap()
                    ;
                cfg.CreateMap<Models.EvaluatedSPUBTask, Data.EvaluatedSPUBTask>()
                    .ReverseMap()
                    ;
                
                cfg.CreateMap<Models.EvaluatedContract, Data.EvaluatedContract>()
                    .ReverseMap()
                    ;
                
                cfg.CreateMap<Models.EvaluatedPublication, Data.EvaluatedPublication>()
                    .ReverseMap()
                    ;
            });
            
            //Create an Instance of Mapper and return that Instance
            var mapper = new Mapper(config);
            return mapper;
        }   
    }
}
    