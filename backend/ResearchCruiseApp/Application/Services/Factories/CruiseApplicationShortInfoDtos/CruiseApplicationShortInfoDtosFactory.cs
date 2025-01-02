using AutoMapper;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.Models.DTOs.Cruises;
using ResearchCruiseApp.Application.Services.CruiseApplicationEvaluator;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.Factories.CruiseApplicationShortInfoDtos;


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