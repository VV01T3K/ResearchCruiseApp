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
                
                
                cfg.CreateMap<Models.EvaluatedResearchTask, Data.EvaluatedResearchTask>()
                    .ForPath(dest => dest.ResearchTask.Title, act => act.MapFrom(src => src.Values.Title))
                    .ForPath(dest => dest.ResearchTask.Author, act => act.MapFrom(src => src.Values.Author))
                    .ForPath(dest => dest.ResearchTask.Institution, act => act.MapFrom(src => src.Values.Institution))
                    .ForPath(dest => dest.ResearchTask.Date, act => act.MapFrom(src => src.Values.Date))
                    .ForPath(dest => dest.ResearchTask.StartDate, act => act.MapFrom(src => src.Values.Time.HasValue ? src.Values.Time.Value.Start : null))
                    .ForPath(dest => dest.ResearchTask.EndDate, act => act.MapFrom(src => src.Values.Time.HasValue ? src.Values.Time.Value.End : null))
                    .ForPath(dest => dest.ResearchTask.FinancingAmount, act => act.MapFrom(src => src.Values.FinancingAmount))
                    .ForPath(dest => dest.ResearchTask.Description, act => act.MapFrom(src => src.Values.Description))
                    .ReverseMap()
                    ;
                
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
    