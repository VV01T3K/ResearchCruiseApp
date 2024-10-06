using AutoMapper;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.Models.DTOs.Cruises;
using ResearchCruiseApp_API.Application.Services.CruiseApplicationEvaluator;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.Factories.CruiseApplicationShortInfoDtos;


internal class CruiseApplicationShortInfoDtosFactory(
    IMapper mapper, 
    ICruiseApplicationEvaluator cruiseApplicationEvaluator)
    : ICruiseApplicationShortInfoDtosFactory
{
    public CruiseApplicationShortInfoDto Create(CruiseApplication cruiseApplication)
    {
        var cruiseApplicationShortInfoDto = mapper.Map<CruiseApplicationShortInfoDto>(cruiseApplication);

        cruiseApplicationShortInfoDto.Points = cruiseApplicationEvaluator.GetPointsSum(cruiseApplication).ToString();
        
        return cruiseApplicationShortInfoDto;
    }
}