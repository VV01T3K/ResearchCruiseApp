using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.Factories.FormCDtos;

public interface IFormCDtosFactory
{
    Task<FormCDto> Create(FormC formC);
}
