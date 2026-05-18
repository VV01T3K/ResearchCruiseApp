using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Factories.FormCDtos;

public interface IFormCDtosFactory
{
    Task<FormCDto> Create(FormC formC);
}
