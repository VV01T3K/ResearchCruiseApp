using ResearchCruiseApp.Application.Models.DTOs.Cruises;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.Factories.CruiseBlockadePeriodDtos;

public interface ICruiseBlockadePeriodDtosFactory
{
    Task<CruiseBlockadePeriodDto> Create(Cruise cruise);
}
