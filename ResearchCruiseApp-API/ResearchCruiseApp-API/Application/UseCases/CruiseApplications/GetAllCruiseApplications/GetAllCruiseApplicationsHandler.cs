using AutoMapper;
using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Application.SharedServices.CruiseApplicationDtos;
using ResearchCruiseApp_API.Domain.Entities;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.GetAllCruiseApplications;


public class GetAllCruiseApplicationsHandler(
    IMapper mapper,
    ICruiseApplicationDtosService cruiseApplicationDtosService,
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
            cruiseApplicationDtos.Add(await cruiseApplicationDtosService.CreateCruiseApplicationDto(cruiseApplication));
        }

        return cruiseApplicationDtos;
    }
}