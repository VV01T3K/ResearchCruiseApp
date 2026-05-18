using AutoMapper;
using ResearchCruiseApp.Api.Applications.Workflows;
using ResearchCruiseApp.Api.Cruises.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Factories.CruiseApplicationShortInfoDtos;

internal class CruiseApplicationShortInfoDtosFactory(
    IMapper mapper,
    ICruiseApplicationEvaluator cruiseApplicationEvaluator
) : ICruiseApplicationShortInfoDtosFactory
{
    public CruiseApplicationShortInfoDto Create(CruiseApplication cruiseApplication)
    {
        var cruiseApplicationShortInfoDto = mapper.Map<CruiseApplicationShortInfoDto>(
            cruiseApplication
        );

        cruiseApplicationShortInfoDto.Points = cruiseApplicationEvaluator
            .GetPointsSum(cruiseApplication)
            .ToString();

        return cruiseApplicationShortInfoDto;
    }
}
