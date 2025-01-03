using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.Factories.FormADtos;

public interface IFormADtosFactory
{
    Task<FormADto> Create(FormA formA);
}
