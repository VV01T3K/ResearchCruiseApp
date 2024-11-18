using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Domain.Common.Enums;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.Factories.CruiseApplications;


internal class CruiseApplicationsFactory(
    IRandomGenerator randomGenerator)
    : ICruiseApplicationsFactory
{
    public CruiseApplication Create(FormA formA, bool isDraft = false)
    {
        var newCruiseApplication = new CruiseApplication
        {
            Date = DateOnly.FromDateTime(DateTime.Now),
            FormA = formA,
            FormB = null,
            FormC = null,
            Status = isDraft ? CruiseApplicationStatus.Draft : CruiseApplicationStatus.WaitingForSupervisor,
            SupervisorCode = randomGenerator.CreateSecureCodeBytes()
        };

        return newCruiseApplication;
    }
}