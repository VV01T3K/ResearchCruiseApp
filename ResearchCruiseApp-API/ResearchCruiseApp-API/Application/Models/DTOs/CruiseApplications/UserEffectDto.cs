using AutoMapper;
using Microsoft.Extensions.Options;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;


public class UserEffectDto
{
    public Guid Id { get; init; }

    public Guid UserId { get; init; }

    public ResearchTaskEffectDto Effect { get; init; } = null!;

    public string Points { get; init; } = "0";

    public string CruiseApplicationId { get; init; } = null!;


    private class MapProfile : Profile
    {
        public MapProfile()
        {
            CreateMap<UserEffect, UserEffectDto>()
                .ForMember(
                    dest => dest.CruiseApplicationId,
                    options =>
                        options.MapFrom(src => src.Effect.FormC.CruiseApplication.Id));
        }
    }
}