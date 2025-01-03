using ResearchCruiseApp.Application.Models.DTOs.Forms;

namespace ResearchCruiseApp.Application.Services.Factories.FormBInitValuesDtos;

public interface IFormBInitValuesDtosFactory
{
    Task<FormBInitValuesDto> Create(CancellationToken cancellationToken);
}
