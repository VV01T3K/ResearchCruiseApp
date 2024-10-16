using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Domain.Common.Enums;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.Factories.CruiseApplications;


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
            Date = DateOnly.FromDateTime(DateTime.Now),
            FormA = formA,
            FormB = null,
            FormC = null,
            Status = CruiseApplicationStatus.WaitingForSupervisor,
            SupervisorCode = randomGenerator.CreateSecureCodeBytes()
        };
        await AddCruiseApplicationEffects(newCruiseApplication, formA, cancellationToken);

        return newCruiseApplication;
    }


    private async Task AddCruiseApplicationEffects(
        CruiseApplication cruiseApplication, FormA formA, CancellationToken cancellationToken)
    {
        var otherCruiseApplications = await cruiseApplicationsRepository
            .GetAllByUserIdWithFormAAndFormCContent(formA.CruiseManagerId, cancellationToken);

        foreach (var otherCruiseApplication in otherCruiseApplications)
        {
            if (otherCruiseApplication.FormC is null)
                continue;

            foreach (var researchTaskEffect in otherCruiseApplication.FormC.ResearchTaskEffects)
            {
                var cruiseApplicationEffect = new CruiseApplicationEffect { Effect = researchTaskEffect };
                cruiseApplication.CruiseApplicationEffects.Add(cruiseApplicationEffect);
            }
        }
    }
}