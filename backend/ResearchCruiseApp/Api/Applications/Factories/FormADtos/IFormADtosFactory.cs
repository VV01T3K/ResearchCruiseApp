using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Factories.FormADtos;

public interface IFormADtosFactory
{
    Task<FormADto> Create(FormA formA);
}
