using AutoMapper;
using ResearchCruiseApp.Application.Common.Extensions;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Application.Services.CruiseApplicationEvaluator;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.Factories.CruiseApplicationDtos;

internal class CruiseApplicationDtosFactory(
    ICruiseApplicationEvaluator cruiseApplicationEvaluator,
    IMapper mapper,
    IIdentityService identityService
) : ICruiseApplicationDtosFactory
{
    public async Task<CruiseApplicationDto> Create(CruiseApplication cruiseApplication)
    {
        var cruiseApplicationDto = mapper.Map<CruiseApplicationDto>(cruiseApplication);

        await AddManagers(cruiseApplication, cruiseApplicationDto);
        AddPoints(cruiseApplication, cruiseApplicationDto);
        AddEffectsDoneRate(cruiseApplication, cruiseApplicationDto);

        return cruiseApplicationDto;
    }

    private async Task AddManagers(
        CruiseApplication cruiseApplication,
        CruiseApplicationDto cruiseApplicationDto
    )
    {
        var cruiseManagerId = cruiseApplication.FormA?.CruiseManagerId;
        var deputyManagerId = cruiseApplication.FormA?.DeputyManagerId;

        if (cruiseManagerId is not null)
        {
            var cruiseManager = await identityService.GetUserDtoById((Guid)cruiseManagerId);
            cruiseApplicationDto.CruiseManagerEmail = cruiseManager?.Email ?? string.Empty;
            cruiseApplicationDto.CruiseManagerFirstName = cruiseManager?.FirstName ?? string.Empty;
            cruiseApplicationDto.CruiseManagerLastName = cruiseManager?.LastName ?? string.Empty;
        }

        if (deputyManagerId is not null)
        {
            var deputyManager = await identityService.GetUserDtoById((Guid)deputyManagerId);
            cruiseApplicationDto.DeputyManagerEmail = deputyManager?.Email ?? string.Empty;
            cruiseApplicationDto.DeputyManagerFirstName = deputyManager?.FirstName ?? string.Empty;
            cruiseApplicationDto.DeputyManagerLastName = deputyManager?.LastName ?? string.Empty;
        }
    }

    private void AddPoints(
        CruiseApplication cruiseApplication,
        CruiseApplicationDto cruiseApplicationDto
    )
    {
        cruiseApplicationDto.Points = cruiseApplicationEvaluator.GetPointsSum(cruiseApplication);
    }

    private void AddEffectsDoneRate(
        CruiseApplication cruiseApplication,
        CruiseApplicationDto cruiseApplicationDto
    )
    {
        if (cruiseApplication.FormC is null)
            return;

        var allEffectsCount = cruiseApplication.FormC.ResearchTaskEffects.Count;
        var doneEffectsCount = cruiseApplication.FormC.ResearchTaskEffects.Count(
            researchTaskEffect => researchTaskEffect.Done.ToBool()
        );

        var effectsDoneRate = $"{100 * (float)doneEffectsCount / allEffectsCount:f2}";

        cruiseApplicationDto.EffectsDoneRate = $"{effectsDoneRate}%";
    }
}
