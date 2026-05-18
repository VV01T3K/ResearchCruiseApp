using AutoMapper;
using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Mapping;

internal class UserEffectDtoProfile : Profile
{
    public UserEffectDtoProfile()
    {
        CreateMap<UserEffect, UserEffectDto>()
            .ForMember(
                dest => dest.CruiseApplicationId,
                options => options.MapFrom(src => src.Effect.FormC.CruiseApplication.Id)
            );
    }
}
