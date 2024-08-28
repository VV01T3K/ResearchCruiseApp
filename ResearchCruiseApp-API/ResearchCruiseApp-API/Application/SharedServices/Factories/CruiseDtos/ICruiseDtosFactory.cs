using ResearchCruiseApp_API.Application.Models.DTOs.Cruises;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.SharedServices.Factories.CruiseDtos;


public interface ICruiseDtosFactory
{
    Task<CruiseDto> Create(Cruise cruise);
}