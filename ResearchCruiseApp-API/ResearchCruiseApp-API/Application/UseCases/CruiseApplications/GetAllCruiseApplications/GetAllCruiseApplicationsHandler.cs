using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Application.SharedServices.Factories.CruiseApplicationDtos;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.GetAllCruiseApplications;


public class GetAllCruiseApplicationsHandler(
    ICruiseApplicationDtosFactory cruiseApplicationDtosFactory,
    ICruiseApplicationsRepository cruiseApplicationsRepository) 
    : IRequestHandler<GetAllCruiseApplicationsQuery, Result<List<CruiseApplicationDto>>>
{
    public async Task<Result<List<CruiseApplicationDto>>> Handle(
        GetAllCruiseApplicationsQuery request,
        CancellationToken cancellationToken)
    {
        var cruiseApplications =
            await cruiseApplicationsRepository.GetAll(cancellationToken);
            
        var cruiseApplicationDtos = new List<CruiseApplicationDto>();
        foreach (var cruiseApplication in cruiseApplications)
        {
            cruiseApplicationDtos.Add(await cruiseApplicationDtosFactory.Create(cruiseApplication));
        }

        return cruiseApplicationDtos;
    }
}