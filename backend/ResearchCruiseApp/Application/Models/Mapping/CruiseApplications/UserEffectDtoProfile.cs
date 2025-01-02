using AutoMapper;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Models.Mapping.CruiseApplications;


internal class UserEffectDtoProfile : Profile
{
    public UserEffectDtoProfile()
    {
        CreateMap<UserEffect, UserEffectDto>()
            .ForMember(
                dest => dest.CruiseApplicationId,
                options =>
                    options.MapFrom(src => src.Effect.FormC.CruiseApplication.Id));
    }
}