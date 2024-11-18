using MediatR;
using ResearchCruiseApp_API.Application.ExternalServices.Persistence.Repositories;
using ResearchCruiseApp_API.Application.Models.Common.ServiceResult;
using ResearchCruiseApp_API.Application.Models.DTOs.CruiseApplications;
using ResearchCruiseApp_API.Application.Services.Factories.FormADtos;
using ResearchCruiseApp_API.Application.Services.UserPermissionVerifier;

namespace ResearchCruiseApp_API.Application.UseCases.CruiseApplications.GetFormA;


public class GetFormAHandler(
    ICruiseApplicationsRepository cruiseApplicationsRepository,
    IFormADtosFactory formADtosFactory,
    IUserPermissionVerifier userPermissionVerifier)
    : IRequestHandler<GetFormAQuery, Result<FormADto>>
{
    public async Task<Result<FormADto>> Handle(GetFormAQuery request, CancellationToken cancellationToken)
    {
        var cruiseApplication = await cruiseApplicationsRepository
            .GetByIdWithFormAContent(request.ApplicationId, cancellationToken);
        if (cruiseApplication?.FormA is null)
            return Error.ResourceNotFound();

        if (!await userPermissionVerifier.CanCurrentUserViewForm(cruiseApplication))
            return Error.ResourceNotFound();
        
        return await formADtosFactory.Create(cruiseApplication.FormA);
    }
}