using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.Factories.FormsC;


public interface IFormsCFactory
{
    Task<Result<FormC>> Create(FormCDto formCDto, CancellationToken cancellationToken);
}