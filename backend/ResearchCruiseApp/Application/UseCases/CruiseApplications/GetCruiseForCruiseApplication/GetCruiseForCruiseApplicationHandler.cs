using MediatR;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.Cruises;
using ResearchCruiseApp.Application.Services.Factories.CruiseDtos;
using ResearchCruiseApp.Application.Services.UserPermissionVerifier;

namespace ResearchCruiseApp.Application.UseCases.CruiseApplications.GetCruiseForCruiseApplication;

public class GetCruiseForCruiseApplicationHandler(
    ICruiseApplicationsRepository cruiseApplicationsRepository,
    IUserPermissionVerifier userPermissionVerifier,
    ICruiseDtosFactory cruiseDtosFactory
) : IRequestHandler<GetCruiseForCruiseApplicationQuery, Result<CruiseDto>>
{
    public async Task<Result<CruiseDto>> Handle(
        GetCruiseForCruiseApplicationQuery request,
        CancellationToken cancellationToken
    )
    {
        var cruiseApplication = await cruiseApplicationsRepository.GetByIdWithForms(
            request.CruiseApplicationId,
            cancellationToken
        );
        if (cruiseApplication?.Cruise is null)
            return Error.ResourceNotFound();

        if (!await userPermissionVerifier.CanCurrentUserViewForm(cruiseApplication))
            return Error.ResourceNotFound();

        var cruiseDto = await cruiseDtosFactory.Create(cruiseApplication.Cruise);
        return cruiseDto;
    }
}
