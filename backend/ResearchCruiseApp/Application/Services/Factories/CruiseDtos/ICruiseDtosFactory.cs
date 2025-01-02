using ResearchCruiseApp.Application.Models.DTOs.Cruises;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.Factories.CruiseDtos;


public interface ICruiseDtosFactory
{
    Task<CruiseDto> Create(Cruise cruise);
}