using AutoMapper;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.SharedServices.CruiseApplicationDtos;


internal class CruiseApplicationDtosService(
    IMapper mapper,
    IIdentityService identityService)
    : ICruiseApplicationDtosService
{
    public async Task<CruiseApplicationDto> CreateCruiseApplicationDto(CruiseApplication cruiseApplication)
    {
        // Managers data is not auto-mapped
        var cruiseApplicationDto = mapper.Map<CruiseApplicationDto>(cruiseApplication);
        
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

        return cruiseApplicationDto;
    }
}