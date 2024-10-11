using System.Runtime.InteropServices.JavaScript;
using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.Models.DTOs.Cruises;
using ResearchCruiseApp_API.Application.Services.Factories.CruiseDtos;
using ResearchCruiseApp_API.Application.Services.UserPermissionVerifier;

namespace ResearchCruiseApp_API.Application.UseCases.Cruises.GetCruise;


public class GetCruiseHandler(ICruiseDtosFactory cruiseDtosFactory, ICruisesRepository cruisesRepository, 
    IUserPermissionVerifier userPermissionVerifier)
    : IRequestHandler<GetCruiseQuery, Result<CruiseDto>>
{
    public async Task<Result<CruiseDto>> Handle(GetCruiseQuery request, CancellationToken cancellationToken)
    {
        var cruise = await cruisesRepository.GetByIdWithCruiseApplications(request.Id, cancellationToken);
        
        if(await userPermissionVerifier.CanCurrentUserViewCruise(cruise)) 
            return await cruiseDtosFactory.Create(cruise);
   
        return Error.NotFound();
    }
}