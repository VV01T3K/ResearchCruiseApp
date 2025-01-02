using MediatR;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Application.Services.Factories.FormBDtos;
using ResearchCruiseApp.Application.Services.UserPermissionVerifier;

namespace ResearchCruiseApp.Application.UseCases.CruiseApplications.GetFormB;


public class GetFormBHandler(
    ICruiseApplicationsRepository cruiseApplicationsRepository,
    IFormBDtosFactory formBDtosFactory,
    IUserPermissionVerifier userPermissionVerifier)
    : IRequestHandler<GetFormBQuery, Result<FormBDto>>
{
    public async Task<Result<FormBDto>> Handle(GetFormBQuery request, CancellationToken cancellationToken)
    {
        var cruiseApplication = await cruiseApplicationsRepository
            .GetByIdWithFormAAndFormBContent(request.CruiseApplicationId, cancellationToken);
        if (cruiseApplication?.FormB is null)
            return Error.ResourceNotFound();

        if (!await userPermissionVerifier.CanCurrentUserViewForm(cruiseApplication))
            return Error.ResourceNotFound();

        var formBDto = await formBDtosFactory.Create(cruiseApplication.FormB, cancellationToken);
        return formBDto;
    }
}