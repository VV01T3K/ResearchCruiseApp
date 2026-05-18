using ResearchCruiseApp.Api.Cruises.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Factories.CruiseApplicationShortInfoDtos;

public interface ICruiseApplicationShortInfoDtosFactory
{
    CruiseApplicationShortInfoDto Create(CruiseApplication cruiseApplication);
}
