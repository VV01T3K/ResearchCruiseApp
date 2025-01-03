using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.Factories.FormBDtos;

public interface IFormBDtosFactory
{
    Task<FormBDto> Create(FormB formB, CancellationToken cancellationToken);
}
