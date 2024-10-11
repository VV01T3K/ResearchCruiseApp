using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Application.Services.Factories.CruiseApplicationDtos;
using ResearchCruiseApp_API.Application.Services.UserPermissionVerifier;
using ResearchCruiseApp_API.Domain.Common.Enums;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.GetCruiseApplicationsForCruise;


public class GetCruiseApplicationsForCruiseHandler(
    ICruiseApplicationDtosFactory cruiseApplicationDtosFactory,
    ICruiseApplicationsRepository cruiseApplicationsRepository,
    IUserPermissionVerifier userPermissionVerifier) 
    : IRequestHandler<GetCruiseApplicationsForCruiseQuery, Result<List<CruiseApplicationDto>>>
{
    public async Task<Result<List<CruiseApplicationDto>>> Handle(
        GetCruiseApplicationsForCruiseQuery request,
        CancellationToken cancellationToken)
    {
        var cruiseApplications = await cruiseApplicationsRepository
            .GetAllWithFormsAndFormAContent(cancellationToken);
            
        var cruiseApplicationDtos = new List<CruiseApplicationDto>();
        
        foreach (var cruiseApplication in cruiseApplications)
        {   
            if(cruiseApplication.Status != CruiseApplicationStatus.Accepted)
                continue;
            
            if (await userPermissionVerifier.CanCurrentUserViewCruiseApplication(cruiseApplication)) 
                cruiseApplicationDtos.Add(await cruiseApplicationDtosFactory.Create(cruiseApplication));
        }

        return cruiseApplicationDtos;
    }
}