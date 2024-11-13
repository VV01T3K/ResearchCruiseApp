using AutoMapper;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.Mapping.CruiseApplications;


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