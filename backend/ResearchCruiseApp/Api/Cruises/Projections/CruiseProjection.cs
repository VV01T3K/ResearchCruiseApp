using ResearchCruiseApp.Api.Applications.Workflows;
using ResearchCruiseApp.Api.Cruises.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Cruises.Projections;

internal class CruiseProjection(
    IIdentityService identityService,
    ICruiseApplicationEvaluator evaluator
)
{
    public async Task<CruiseDto> Create(Cruise cruise)
    {
        var dto = CruiseMappings.ToCruiseDto(cruise);
        var manager = await identityService.GetUserDtoById(cruise.MainCruiseManagerId);
        dto.MainCruiseManagerFirstName = manager?.FirstName ?? string.Empty;
        dto.MainCruiseManagerLastName = manager?.LastName ?? string.Empty;

        var deputy = await identityService.GetUserDtoById(cruise.MainDeputyManagerId);
        dto.MainDeputyManagerFirstName = deputy?.FirstName ?? string.Empty;
        dto.MainDeputyManagerLastName = deputy?.LastName ?? string.Empty;
        dto.CruiseApplicationsShortInfo = cruise
            .CruiseApplications.Select(CreateShortInfo)
            .ToList();

        return dto;
    }

    private CruiseApplicationShortInfoDto CreateShortInfo(CruiseApplication application)
    {
        var dto = CruiseMappings.ToCruiseApplicationShortInfoDto(application);
        dto.Points = evaluator.GetPointsSum(application).ToString();
        return dto;
    }
}
