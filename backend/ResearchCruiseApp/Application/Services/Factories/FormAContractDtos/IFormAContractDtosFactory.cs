using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.Factories.FormAContractDtos;


public interface IFormAContractDtosFactory
{
    Task<FormAContractDto> Create(FormAContract formAContract);
}