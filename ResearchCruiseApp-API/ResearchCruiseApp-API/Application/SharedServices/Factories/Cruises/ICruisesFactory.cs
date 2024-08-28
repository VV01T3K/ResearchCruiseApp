using ResearchCruiseApp_API.Application.Models.DTOs.Cruises;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.SharedServices.Factories.Cruises;


public interface ICruisesFactory
{
    Task<Cruise> Create(CruiseFormDto cruiseFormDto, CancellationToken cancellationToken);
}