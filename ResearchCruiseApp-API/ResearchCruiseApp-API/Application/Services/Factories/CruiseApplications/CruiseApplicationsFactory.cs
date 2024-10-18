using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Common.Enums;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.Factories.CruiseApplications;


internal class CruiseApplicationsFactory(
    IRandomGenerator randomGenerator,
    IUserEffectsRepository userEffectsRepository)
    : ICruiseApplicationsFactory
{
    public async Task<CruiseApplication> Create(FormA formA, CancellationToken cancellationToken)
    {
        var effectsPoints = await userEffectsRepository
            .GetPointsSumByUserId(formA.CruiseManagerId, cancellationToken);
        
        var newCruiseApplication = new CruiseApplication
        {
            Date = DateOnly.FromDateTime(DateTime.Now),
            FormA = formA,
            FormB = null,
            FormC = null,
            Status = CruiseApplicationStatus.WaitingForSupervisor,
            SupervisorCode = randomGenerator.CreateSecureCodeBytes(),
            EffectsPoints = effectsPoints
        };

        return newCruiseApplication;
    }
}