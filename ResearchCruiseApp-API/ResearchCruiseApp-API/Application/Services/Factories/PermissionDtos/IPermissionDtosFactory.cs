using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.Factories.PermissionDtos;


public interface IPermissionDtosFactory
{
    Task<PermissionDto> Create(Permission permission);
}