using ResearchCruiseApp.Api.Cruises.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Factories.CruiseDtos;

public interface ICruiseDtosFactory
{
    Task<CruiseDto> Create(Cruise cruise);
}
