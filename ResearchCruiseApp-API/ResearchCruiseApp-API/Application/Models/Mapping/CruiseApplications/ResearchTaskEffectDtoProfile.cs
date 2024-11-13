using AutoMapper;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.Mapping.CruiseApplications;


internal class ResearchTaskEffectDtoProfile : Profile
{
    public ResearchTaskEffectDtoProfile()
    {
        CreateMap<ResearchTaskEffect, ResearchTaskEffectDto>()
            .ForMember(
                dest => dest.Type,
                options =>
                    options.MapFrom(src => ((int)src.ResearchTask.Type).ToString()))
            .ForMember(
                dest => dest.Title,
                options =>
                    options.MapFrom(src => src.ResearchTask.Title))
            .ForMember(
                dest => dest.Magazine,
                options =>
                    options.MapFrom(src => src.ResearchTask.Magazine))
            .ForMember(
                dest => dest.Author,
                options =>
                    options.MapFrom(src => src.ResearchTask.Author))
            .ForMember(
                dest => dest.Institution,
                options =>
                    options.MapFrom(src => src.ResearchTask.Institution))
            .ForMember(
                dest => dest.Date,
                options =>
                    options.MapFrom(src => src.ResearchTask.Date))
            .ForMember(
                dest => dest.StartDate,
                options =>
                    options.MapFrom(src => src.ResearchTask.StartDate))
            .ForMember(
                dest => dest.EndDate,
                options =>
                    options.MapFrom(src => src.ResearchTask.EndDate))
            .ForMember(
                dest => dest.FinancingAmount,
                options =>
                    options.MapFrom(src => src.ResearchTask.FinancingAmount))
            .ForMember(
                dest => dest.FinancingApproved,
                options =>
                    options.MapFrom(src => src.ResearchTask.FinancingApproved))
            .ForMember(
                dest => dest.Description,
                options =>
                    options.MapFrom(src => src.ResearchTask.Description))
            .ForMember(
                dest => dest.SecuredAmount,
                options =>
                    options.MapFrom(src => src.ResearchTask.SecuredAmount))
            .ForMember(
                dest => dest.MinisterialPoints,
                options =>
                    options.MapFrom(src => src.ResearchTask.MinisterialPoints));
    }
}