using ResearchCruiseApp_API.Application.Models.DTOs.Forms;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.Factories.FormAInitValuesDtos;


public interface IFormAInitValuesDtosFactory
{
    Task<FormAInitValuesDto> Create(CancellationToken cancellationToken);
    
    Task<FormAInitValuesDto> CreateForSupervisor(
        CruiseApplication cruiseApplication, CancellationToken cancellationToken);
}