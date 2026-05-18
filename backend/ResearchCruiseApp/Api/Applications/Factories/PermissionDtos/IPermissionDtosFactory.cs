using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Factories.PermissionDtos;

public interface IPermissionDtosFactory
{
    Task<PermissionDto> Create(Permission permission);
}
