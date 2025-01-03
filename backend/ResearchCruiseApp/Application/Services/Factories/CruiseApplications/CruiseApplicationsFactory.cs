using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Domain.Common.Enums;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.Factories.CruiseApplications;

internal class CruiseApplicationsFactory(
    IRandomGenerator randomGenerator,
    IGlobalizationService globalizationService
) : ICruiseApplicationsFactory
{
    public CruiseApplication Create(FormA formA, string? note, bool isDraft = false)
    {
        var newCruiseApplication = new CruiseApplication
        {
            Date = GetCurrentDate(),
            FormA = formA,
            FormB = null,
            FormC = null,
            Status = isDraft
                ? CruiseApplicationStatus.Draft
                : CruiseApplicationStatus.WaitingForSupervisor,
            SupervisorCode = randomGenerator.CreateSecureCodeBytes(),
            Note = note,
        };

        return newCruiseApplication;
    }

    private DateOnly GetCurrentDate()
    {
        var localDateTime = TimeZoneInfo.ConvertTimeFromUtc(
            DateTime.UtcNow,
            globalizationService.GetTimeZoneInfo()
        );
        return DateOnly.FromDateTime(localDateTime);
    }
}
