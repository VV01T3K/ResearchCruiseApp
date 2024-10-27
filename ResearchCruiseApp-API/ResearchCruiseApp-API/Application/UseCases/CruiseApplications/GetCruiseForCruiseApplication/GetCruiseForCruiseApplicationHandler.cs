using MediatR;
using ResearchCruiseApp_API.Application.Common.Models.ServiceResult;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.Models.DTOs.Cruises;
using ResearchCruiseApp_API.Application.Services.Factories.CruiseDtos;
using ResearchCruiseApp_API.Application.Services.UserPermissionVerifier;


namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.GetCruiseForCruiseApplication;


public class GetCruiseForCruiseApplicationHandler(
    ICruiseApplicationsRepository cruiseApplicationsRepository,
    IUserPermissionVerifier userPermissionVerifier,
    ICruiseDtosFactory cruiseDtosFactory)
    : IRequestHandler<GetCruiseForCruiseApplicationQuery, Result<CruiseDto>>
{
    public async Task<Result<CruiseDto>> Handle(GetCruiseForCruiseApplicationQuery request, CancellationToken cancellationToken)
    {
        var cruiseApplication = await cruiseApplicationsRepository
            .GetByIdWithForms(request.CruiseApplicationId, cancellationToken);
        if (cruiseApplication?.Cruise is null)
            return Error.ResourceNotFound();
        
        if (!await userPermissionVerifier.CanCurrentUserViewForm(cruiseApplication))
            return Error.ResourceNotFound();

        var cruiseDto = await cruiseDtosFactory.Create(cruiseApplication.Cruise);
        return cruiseDto;
    }
}