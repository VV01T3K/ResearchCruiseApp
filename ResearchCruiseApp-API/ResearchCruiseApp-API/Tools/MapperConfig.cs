using AutoMapper;
using ResearchCruiseApp_API.Data;
using ResearchCruiseApp_API.Models;

namespace ResearchCruiseApp_API.Tools
{
    public class MapperConfig
    {
        public static Mapper InitializeAutomapper()
        {
            //Provide all the Mapping Configuration
            var config = new MapperConfiguration(cfg =>
            {
                //Configuring FormsModel and FormA
                cfg.CreateMap<FormsModel, FormA>()
                    .ForMember(dest => dest.Year, act => act.MapFrom(src => src.CruiseInfoData.Year))
                    .ForMember(dest => dest.CruiseHours, act => act.MapFrom(src => src.CruiseInfoData.CruiseHours))
                    .ForMember(dest => dest.DateComment, act => act.MapFrom(src => src.CruiseInfoData.PeriodNotes))
                    .ForMember(dest => dest.ShipUsage, act => act.MapFrom(src => src.CruiseInfoData.ShipUsage))
                    ;// .ReverseMap()
                    // .ForPath(dest => dest.CruiseInfoData.Year, opt => opt.MapFrom(src => src.Year))
                    // .ForPath(dest => dest.CruiseInfoData.CruiseHours, opt => opt.MapFrom(src => src.CruiseHours))
                    // .ForPath(dest => dest.CruiseInfoData.DateComment, opt => opt.MapFrom(src => src.DateComment))
                    // .ForPath(dest => dest.CruiseInfoData.ShipUsage, opt => opt.MapFrom(src => src.ShipUsage));

                // cfg.CreateMap<FormA, FormsModel>()
                //     .ForPath(dest => dest.CruiseInfoData.Year, opt => opt.MapFrom(src => src.Year))
                //     .ForPath(dest => dest.CruiseInfoData.CruiseHours, opt => opt.MapFrom(src => src.CruiseHours))
                //     .ForPath(dest => dest.CruiseInfoData.DateComment, opt => opt.MapFrom(src => src.DateComment))
                //     .ForPath(dest => dest.CruiseInfoData.ShipUsage, opt => opt.MapFrom(src => src.ShipUsage));

                cfg.CreateMap<FormA, FormsModel>()
                    .ForMember(dest => dest.CruiseInfoData,
                        opt => 
                            opt.MapFrom(src => 
                                new CruiseInfo() { Year = src.Year, CruiseHours = src.CruiseHours, PeriodNotes = src.DateComment, ShipUsage = src.ShipUsage}));

            });
            
            //Create an Instance of Mapper and return that Instance
            var mapper = new Mapper(config);
            return mapper;
        }   
    }
}
    