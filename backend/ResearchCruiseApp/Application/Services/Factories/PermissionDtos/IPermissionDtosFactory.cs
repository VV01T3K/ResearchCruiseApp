using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.Factories.PermissionDtos;


public interface IPermissionDtosFactory
{
    Task<PermissionDto> Create(Permission permission);
}