using AutoMapper;
using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Mapping;

internal class CruiseDayDetailsDtoProfile : Profile
{
    public CruiseDayDetailsDtoProfile()
    {
        CreateMap<CruiseDayDetailsDto, CruiseDayDetails>();

        CreateMap<CruiseDayDetails, CruiseDayDetailsDto>();
    }
}
