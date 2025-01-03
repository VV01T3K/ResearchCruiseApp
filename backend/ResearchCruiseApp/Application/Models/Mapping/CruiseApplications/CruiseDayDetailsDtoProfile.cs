using AutoMapper;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Models.Mapping.CruiseApplications;

internal class CruiseDayDetailsDtoProfile : Profile
{
    public CruiseDayDetailsDtoProfile()
    {
        CreateMap<CruiseDayDetailsDto, CruiseDayDetails>();

        CreateMap<CruiseDayDetails, CruiseDayDetailsDto>();
    }
}
