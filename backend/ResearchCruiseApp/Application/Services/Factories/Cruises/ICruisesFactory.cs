using ResearchCruiseApp.Application.Models.DTOs.Cruises;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.Factories.Cruises;

public interface ICruisesFactory
{
    Task<Cruise> Create(CruiseFormDto cruiseFormDto, CancellationToken cancellationToken);
}
