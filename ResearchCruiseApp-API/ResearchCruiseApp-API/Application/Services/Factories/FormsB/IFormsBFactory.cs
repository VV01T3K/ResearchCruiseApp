using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.Factories.FormsB;


public interface IFormsBFactory
{
    Task<FormB> Create(FormBDto formBDto, CancellationToken cancellationToken);
}