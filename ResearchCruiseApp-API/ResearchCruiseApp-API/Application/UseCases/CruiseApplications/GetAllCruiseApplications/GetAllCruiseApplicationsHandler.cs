using MediatR;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.Models.Common.ServiceResult;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Application.Services.Factories.CruiseApplicationDtos;
using ResearchCruiseApp_API.Application.Services.UserPermissionVerifier;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.GetAllCruiseApplications;


public class GetAllCruiseApplicationsHandler(
    ICruiseApplicationDtosFactory cruiseApplicationDtosFactory,
    ICruiseApplicationsRepository cruiseApplicationsRepository,
    IUserPermissionVerifier userPermissionVerifier) 
    : IRequestHandler<GetAllCruiseApplicationsQuery, Result<List<CruiseApplicationDto>>>
{
    public async Task<Result<List<CruiseApplicationDto>>> Handle(
        GetAllCruiseApplicationsQuery request,
        CancellationToken cancellationToken)
    {
        var cruiseApplications = await cruiseApplicationsRepository
            .GetAllWithFormsAndFormAContent(cancellationToken);
            
        var cruiseApplicationDtos = new List<CruiseApplicationDto>();
        
        foreach (var cruiseApplication in cruiseApplications)
        {
            if (await userPermissionVerifier.CanCurrentUserViewCruiseApplication(cruiseApplication)) 
                cruiseApplicationDtos.Add(await cruiseApplicationDtosFactory.Create(cruiseApplication));
        }

        return cruiseApplicationDtos;
    }
}