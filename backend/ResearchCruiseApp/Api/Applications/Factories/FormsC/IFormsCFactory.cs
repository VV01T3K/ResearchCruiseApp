using ResearchCruiseApp.Api.Applications.Contracts;
using ResearchCruiseApp.Api.Common.ServiceResult;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Factories.FormsC;

public interface IFormsCFactory
{
    Task<Result<FormC>> Create(FormCDto formCDto, CancellationToken cancellationToken);
}
