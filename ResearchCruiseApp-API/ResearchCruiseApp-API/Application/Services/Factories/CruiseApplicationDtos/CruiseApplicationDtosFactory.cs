using AutoMapper;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Application.Services.CruiseApplicationEvaluator;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.Services.Factories.CruiseApplicationDtos;


internal class CruiseApplicationDtosFactory(
    ICruiseApplicationEvaluator cruiseApplicationEvaluator,
    IMapper mapper,
    IIdentityService identityService)
    : ICruiseApplicationDtosFactory
{
    public async Task<CruiseApplicationDto> Create(CruiseApplication cruiseApplication)
    {
        var cruiseApplicationDto = mapper.Map<CruiseApplicationDto>(cruiseApplication);

        await AddManagers(cruiseApplication, cruiseApplicationDto);
        AddPoints(cruiseApplication, cruiseApplicationDto);

        return cruiseApplicationDto;
    }


    private async Task AddManagers(CruiseApplication cruiseApplication, CruiseApplicationDto cruiseApplicationDto)
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

    private void AddPoints(CruiseApplication cruiseApplication, CruiseApplicationDto cruiseApplicationDto)
    {
        cruiseApplicationDto.Points = cruiseApplicationEvaluator.GetPointsSum(cruiseApplication);
    }
}