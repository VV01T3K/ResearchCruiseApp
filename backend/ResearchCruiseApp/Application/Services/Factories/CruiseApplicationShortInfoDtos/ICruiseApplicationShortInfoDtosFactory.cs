using ResearchCruiseApp.Application.Models.DTOs.Cruises;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.Factories.CruiseApplicationShortInfoDtos;


public interface ICruiseApplicationShortInfoDtosFactory
{ 
    CruiseApplicationShortInfoDto Create(CruiseApplication cruiseApplication);
}