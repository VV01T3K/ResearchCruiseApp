using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Common.Enums;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.SharedServices.Factories.CruiseApplications;


internal class CruiseApplicationsFactory(
    IYearBasedKeyGenerator yearBasedKeyGenerator,
    IRandomGenerator randomGenerator,
    ICruiseApplicationsRepository cruiseApplicationsRepository)
    : ICruiseApplicationsFactory
{
    public async Task<CruiseApplication> Create(FormA formA, CancellationToken cancellationToken)
    {
        var newCruiseApplication = new CruiseApplication
        {
            Number = await yearBasedKeyGenerator.GenerateKey(cruiseApplicationsRepository, cancellationToken),
            Date = DateOnly.FromDateTime(DateTime.Now),
            FormA = formA,
            FormB = null,
            FormC = null,
            //EvaluatedApplication = evaluatedCruiseApplication,
            Points = 0,
            Status = CruiseApplicationStatus.WaitingForSupervisor,
            SupervisorCode = randomGenerator.CreateSecureCodeBytes()
        };

        return newCruiseApplication;
    }
}