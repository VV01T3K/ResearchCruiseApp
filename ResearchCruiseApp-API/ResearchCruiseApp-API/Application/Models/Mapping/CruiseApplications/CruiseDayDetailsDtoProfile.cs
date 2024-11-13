using AutoMapper;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Models.Mapping.CruiseApplications;


internal class CruiseDayDetailsDtoProfile : Profile
{
    public CruiseDayDetailsDtoProfile()
    {
        CreateMap<CruiseDayDetailsDto, CruiseDayDetails>();
            
        CreateMap<CruiseDayDetails, CruiseDayDetailsDto>();
    }
}