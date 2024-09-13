using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.Factories.FormsA;


public interface IFormsAFactory
{
    Task<FormA> Create(FormADto formADto, CancellationToken cancellationToken);
}