using AutoMapper;
using ResearchCruiseApp.Application.ExternalServices;
using ResearchCruiseApp.Application.Models.DTOs.Cruises;
using ResearchCruiseApp.Application.Services.Factories.CruiseApplicationShortInfoDtos;
using ResearchCruiseApp.Domain.Entities;

namespace ResearchCruiseApp.Application.Services.Factories.CruiseDtos;

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

        cruiseDto.CruiseApplicationsShortInfo = cruise
            .CruiseApplications.Select(cruiseApplicationShortInfoDtosFactory.Create)
            .ToList();
        return cruiseDto;
    }
}
