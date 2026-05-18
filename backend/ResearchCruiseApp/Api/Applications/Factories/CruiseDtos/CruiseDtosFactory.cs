using AutoMapper;
using ResearchCruiseApp.Api.Applications.Factories.CruiseApplicationShortInfoDtos;
using ResearchCruiseApp.Api.Cruises.Contracts;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Api.Applications.Factories.CruiseDtos;

internal class CruiseDtosFactory(
    IMapper mapper,
    IIdentityService identityService,
    ICruiseApplicationShortInfoDtosFactory cruiseApplicationShortInfoDtosFactory
) : ICruiseDtosFactory
{
    public async Task<CruiseDto> Create(Cruise cruise)
    {
        var cruiseDto = mapper.Map<CruiseDto>(cruise);
        var mainCruiseManager = await identityService.GetUserDtoById(cruise.MainCruiseManagerId);

        cruiseDto.MainCruiseManagerFirstName = mainCruiseManager?.FirstName ?? string.Empty;
        cruiseDto.MainCruiseManagerLastName = mainCruiseManager?.LastName ?? string.Empty;

        var mainDeputyManager = await identityService.GetUserDtoById(cruise.MainDeputyManagerId);

        cruiseDto.MainDeputyManagerFirstName = mainDeputyManager?.FirstName ?? string.Empty;
        cruiseDto.MainDeputyManagerLastName = mainDeputyManager?.LastName ?? string.Empty;
        cruiseDto.CruiseApplicationsShortInfo = cruise
            .CruiseApplications.Select(cruiseApplicationShortInfoDtosFactory.Create)
            .ToList();
        return cruiseDto;
    }
}
