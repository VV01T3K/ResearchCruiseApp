using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Factories.CruiseApplicationDtos;

public interface ICruiseApplicationDtosFactory
{
    Task<CruiseApplicationDto> Create(CruiseApplication cruiseApplication);
}
