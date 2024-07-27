using AutoMapper;
using ResearchCruiseApp_API.Application.DTOs;
using ResearchCruiseApp_API.Domain.Entities;
using EvaluatedContract = ResearchCruiseApp_API.Domain.Entities.EvaluatedContract;
using EvaluatedPublication = ResearchCruiseApp_API.Domain.Entities.EvaluatedPublication;
using EvaluatedResearchTask = ResearchCruiseApp_API.Domain.Entities.EvaluatedResearchTask;
using EvaluatedSpubTask = ResearchCruiseApp_API.Application.DTOs.EvaluatedSpubTask;

namespace ResearchCruiseApp_API.Infrastructure.Tools;


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
                
                
            cfg.CreateMap<Application.DTOs.EvaluatedResearchTask, EvaluatedResearchTask>()
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
                
            cfg.CreateMap<EvaluatedCruiseApplicationModel, EvaluatedCruiseApplication>()
                .ReverseMap()
                ;
            cfg.CreateMap<EvaluatedSpubTask, Domain.Entities.EvaluatedSpubTask>()
                .ReverseMap()
                ;
                
            cfg.CreateMap<Application.DTOs.EvaluatedContract, EvaluatedContract>()
                .ReverseMap()
                ;
                
            cfg.CreateMap<Application.DTOs.EvaluatedPublication, EvaluatedPublication>()
                .ReverseMap()
                ;
        });
            
        //Create an Instance of Mapper and return that Instance
        var mapper = new Mapper(config);
        return mapper;
    }
}