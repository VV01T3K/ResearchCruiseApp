using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.SharedServices.CruiseApplicationDtos;


public interface ICruiseApplicationDtosService
{
    Task<CruiseApplicationDto> CreateCruiseApplicationDto(CruiseApplication cruiseApplication);
}