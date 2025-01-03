using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.Factories.FormsC;

public interface IFormsCFactory
{
    Task<Result<FormC>> Create(FormCDto formCDto, CancellationToken cancellationToken);
}
