using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.SharedServices.Factories.CruiseApplicationDtos;


public interface ICruiseApplicationDtosFactory
{
    Task<CruiseApplicationDto> Create(CruiseApplication cruiseApplication);
}