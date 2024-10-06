using ResearchCruiseApp_API.Application.Models.DTOs.Cruises;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.Factories.CruiseApplicationShortInfoDtos;


public interface ICruiseApplicationShortInfoDtosFactory
{ 
    CruiseApplicationShortInfoDto Create(CruiseApplication cruiseApplication);
}