using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Api.Common.ServiceResult;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Factories.FormsA;

public interface IFormsAFactory
{
    Task<Result<FormA>> Create(FormADto formADto, CancellationToken cancellationToken);
}
