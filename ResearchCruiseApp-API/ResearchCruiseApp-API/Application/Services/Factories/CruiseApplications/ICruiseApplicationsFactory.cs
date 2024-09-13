using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.Factories.CruiseApplications;


public interface ICruiseApplicationsFactory
{
    Task<CruiseApplication> Create(FormA formA, CancellationToken cancellationToken);
}