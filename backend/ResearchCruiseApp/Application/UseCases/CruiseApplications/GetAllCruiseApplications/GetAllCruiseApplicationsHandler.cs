using MediatR;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Application.Services.Factories.CruiseApplicationDtos;
using ResearchCruiseApp.Application.Services.UserPermissionVerifier;

namespace ResearchCruiseApp.Application.UseCases.CruiseApplications.GetAllCruiseApplications;


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
            .GetAllWithFormsAndFormAContentAndEffects(cancellationToken);
            
        var cruiseApplicationDtos = new List<CruiseApplicationDto>();
        
        foreach (var cruiseApplication in cruiseApplications)
        {
            if (await userPermissionVerifier.CanCurrentUserViewCruiseApplication(cruiseApplication)) 
                cruiseApplicationDtos.Add(await cruiseApplicationDtosFactory.Create(cruiseApplication));
        }

        return cruiseApplicationDtos;
    }
}