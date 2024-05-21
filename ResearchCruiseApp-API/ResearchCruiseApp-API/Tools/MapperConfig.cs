using AutoMapper;
using ResearchCruiseApp_API.Data;
using ResearchCruiseApp_API.Models;
using Contract = ResearchCruiseApp_API.Data.Contract;

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

                cfg.CreateMap<Models.Contract, Data.Contract>()
                    .ForMember(dest => dest.Institution, act => act.MapFrom(src => src.Institution.Name))
                    .ForMember(dest => dest.Unit, act => act.MapFrom(src => src.Institution.Unit))
                    .ForMember(dest => dest.Location, act => act.MapFrom(src => src.Institution.Localization))
                    ;
                //Configuring FormsModel and FormA
                cfg.CreateMap<FormsModel, FormA>()
                    // .ForMember(dest => dest.CruiseManagerId, act => act.MapFrom(src => src.CruiseInfoData.CruiseManagerId))
                    // .ForMember(dest => dest.DeputyManagerId, act => act.MapFrom(src => src.CruiseInfoData.DeputyManagerId))
                    // .ForMember(dest => dest.Year, act => act.MapFrom(src => src.CruiseInfoData.Year))
                    .ForMember(dest => dest.AcceptablePeriodBeg, act => act.MapFrom(src => src.AcceptablePeriod!.Min()))
                    .ForMember(dest => dest.AcceptablePeriodEnd, act => act.MapFrom(src => src.AcceptablePeriod!.Max()))
                    .ForMember(dest => dest.OptimalPeriodBeg, act => act.MapFrom(src => src.OptimalPeriod!.Min()))
                    .ForMember(dest => dest.OptimalPeriodEnd, act => act.MapFrom(src => src.OptimalPeriod!.Max()))
                    
                    ;

                // cfg.CreateMap<FormA, FormsModel>()
                //     .ForPath(dest => dest.CruiseInfoData.Year, opt => opt.MapFrom(src => src.Year))
                //     .ForPath(dest => dest.CruiseInfoData.CruiseHours, opt => opt.MapFrom(src => src.CruiseHours))
                //     .ForPath(dest => dest.CruiseInfoData.DateComment, opt => opt.MapFrom(src => src.DateComment))
                //     .ForPath(dest => dest.CruiseInfoData.ShipUsage, opt => opt.MapFrom(src => src.ShipUsage));

                cfg.CreateMap<FormA, FormsModel>();
                // .ForMember(dest => dest.CruiseInfoData,
                //     opt => 
                //         opt.MapFrom(src => 
                //             new CruiseInfo() { Id = src.Id, Year = src.Year, CruiseHours = src.CruiseHours, PeriodNotes = src.PeriodNotes, ShipUsage = src.ShipUsage}));

            });
            
            //Create an Instance of Mapper and return that Instance
            var mapper = new Mapper(config);
            return mapper;
        }   
    }
}
    