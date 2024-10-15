using ResearchCruiseApp_API.Application.Models.DTOs.Forms;

namespace ResearchCruiseApp_API.Application.Services.Factories.FormBInitValuesDtos;


public interface IFormBInitValuesDtosFactory
{
    Task<FormBInitValuesDto> Create(CancellationToken cancellationToken);
}