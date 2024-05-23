using AutoMapper;
using ResearchCruiseApp_API.Data;
using ResearchCruiseApp_API.Models;
using Contract = ResearchCruiseApp_API.Data.Contract;
using Publication = ResearchCruiseApp_API.Models.Publication;
using ResearchTask = ResearchCruiseApp_API.Models.ResearchTask;
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
                cfg.CreateMap<Models.SPUBTask, Data.SPUBTask>()
                    ;

                cfg.CreateMap<Publication, Data.Publication>()
                    .ForMember(dest => dest.DOI, act => act.MapFrom(src => src.Info.DOI))
                    .ForMember(dest => dest.Authors, act => act.MapFrom(src => src.Info.Authors))
                    .ForMember(dest => dest.Title, act => act.MapFrom(src => src.Info.Title))
                    .ForMember(dest => dest.Magazine, act => act.MapFrom(src => src.Info.Magazine))
                    ;

                cfg.CreateMap<Work, Data.Work>()
                    .ForMember(dest => dest.Author, act => act.MapFrom(src => src.Info.Author))
                    .ForMember(dest => dest.Title, act => act.MapFrom(src => src.Info.Title))
                    .ForMember(dest => dest.Promoter, act => act.MapFrom(src => src.Info.Promoter))
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
                    ;

                cfg.CreateMap<Models.Contract, Data.Contract>()
                    .ForMember(dest => dest.Institution, act => act.MapFrom(src => src.Institution.Name))
                    .ForMember(dest => dest.Unit, act => act.MapFrom(src => src.Institution.Unit))
                    .ForMember(dest => dest.Location, act => act.MapFrom(src => src.Institution.Localization))
                    ;
                //Configuring FormsModel and FormA
                cfg.CreateMap<FormsModel, FormA>()
                    .ForMember(dest => dest.AcceptablePeriodBeg, act => act.MapFrom(src => src.AcceptablePeriod!.Min()))
                    .ForMember(dest => dest.AcceptablePeriodEnd, act => act.MapFrom(src => src.AcceptablePeriod!.Max()))
                    .ForMember(dest => dest.OptimalPeriodBeg, act => act.MapFrom(src => src.OptimalPeriod!.Min()))
                    .ForMember(dest => dest.OptimalPeriodEnd, act => act.MapFrom(src => src.OptimalPeriod!.Max()))
                    ;

                cfg.CreateMap<FormA, FormsModel>();

            });
            
            //Create an Instance of Mapper and return that Instance
            var mapper = new Mapper(config);
            return mapper;
        }   
    }
}
    