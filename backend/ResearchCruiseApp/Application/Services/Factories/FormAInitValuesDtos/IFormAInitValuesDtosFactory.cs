using ResearchCruiseApp.Application.Models.DTOs.Forms;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.Factories.FormAInitValuesDtos;

public interface IFormAInitValuesDtosFactory
{
    Task<FormAInitValuesDto> Create(CancellationToken cancellationToken);

    Task<FormAInitValuesDto> CreateForSupervisor(
        CruiseApplication cruiseApplication,
        CancellationToken cancellationToken
    );
}
