using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.Factories.FormBDtos;


public interface IFormBDtosFactory
{
    Task<FormBDto> Create(FormB formB, CancellationToken cancellationToken);
}