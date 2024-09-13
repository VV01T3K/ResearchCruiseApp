using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.Factories.FormAContractDtos;


public interface IFormAContractDtosFactory
{
    Task<FormAContractDto> Create(FormAContract formAContract);
}