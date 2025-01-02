using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.Factories.FormsB;


public interface IFormsBFactory
{
    Task<FormB> Create(FormBDto formBDto, CancellationToken cancellationToken);
}