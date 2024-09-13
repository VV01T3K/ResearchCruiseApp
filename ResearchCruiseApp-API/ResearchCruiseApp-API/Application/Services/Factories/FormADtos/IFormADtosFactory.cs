using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.Factories.FormADtos;


public interface IFormADtosFactory
{
    Task<FormADto> Create(FormA formA);
}