using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.Factories.CruiseApplicationDtos;

public interface ICruiseApplicationDtosFactory
{
    Task<CruiseApplicationDto> Create(CruiseApplication cruiseApplication);
}
