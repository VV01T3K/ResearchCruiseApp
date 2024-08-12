using AutoMapper;
using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.GetAllCruiseApplications;


public class GetAllCruiseApplicationsHandler(
    IMapper mapper,
    ICruiseApplicationsRepository cruiseApplicationsRepository,
    IIdentityService identityService) 
    : IRequestHandler<GetAllCruiseApplicationsQuery, Result<List<CruiseApplicationDto>>>
{
    public async Task<Result<List<CruiseApplicationDto>>> Handle(
        GetAllCruiseApplicationsQuery request,
        CancellationToken cancellationToken)
    {
        var cruiseApplications =
            await cruiseApplicationsRepository.GetAllCruiseApplications(cancellationToken);
            
        var cruiseApplicationDtos = new List<CruiseApplicationDto>();
        foreach (var cruiseApplication in cruiseApplications)
        {
            cruiseApplicationDtos.Add(await CreateCruiseApplicationDto(cruiseApplication));
        }

        return cruiseApplicationDtos;
    }


    private async Task<CruiseApplicationDto> CreateCruiseApplicationDto(CruiseApplication cruiseApplication)
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