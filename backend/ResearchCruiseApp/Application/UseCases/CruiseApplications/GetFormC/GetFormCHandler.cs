using MediatR;
using ResearchCruiseApp.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp.Application.Models.Common.ServiceResult;
using ResearchCruiseApp.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp.Application.Services.Factories.FormCDtos;
using ResearchCruiseApp.Application.Services.UserPermissionVerifier;

namespace ResearchCruiseApp.Application.UseCases.CruiseApplications.GetFormC;

public class GetFormCHandler(
    ICruiseApplicationsRepository cruiseApplicationsRepository,
    IUserPermissionVerifier userPermissionVerifier,
    IFormCDtosFactory formCDtosFactory
) : IRequestHandler<GetFormCQuery, Result<FormCDto>>
{
    public async Task<Result<FormCDto>> Handle(
        GetFormCQuery request,
        CancellationToken cancellationToken
    )
    {
        var cruiseApplication = await cruiseApplicationsRepository.GetByIdWithFormAAndFormCContent(
            request.CruiseApplicationId,
            cancellationToken
        );
        if (cruiseApplication?.FormC is null)
            return Error.ResourceNotFound();

        if (!await userPermissionVerifier.CanCurrentUserViewForm(cruiseApplication))
            return Error.ResourceNotFound();

        var formCDto = await formCDtosFactory.Create(cruiseApplication.FormC);
        return formCDto;
    }
}
