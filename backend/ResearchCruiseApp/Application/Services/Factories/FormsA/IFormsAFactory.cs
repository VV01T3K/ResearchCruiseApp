using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.Factories.FormsA;


public interface IFormsAFactory
{
    Task<Result<FormA>> Create(FormADto formADto, CancellationToken cancellationToken);
}